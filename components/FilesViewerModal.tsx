import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft } from '@styled-icons/boxicons-regular/ChevronLeft';
import { ChevronRight } from '@styled-icons/boxicons-regular/ChevronRight';
import { ArrowDownTray } from '@styled-icons/heroicons-outline/ArrowDownTray';
import { ArrowTopRightOnSquare } from '@styled-icons/heroicons-outline/ArrowTopRightOnSquare';
import { XMark } from '@styled-icons/heroicons-outline/XMark';
import { themeGet } from '@styled-system/theme-get';
import FocusTrap from 'focus-trap-react';
import { endsWith } from 'lodash';
import dynamic from 'next/dynamic';
import { createPortal } from 'react-dom';
import { useIntl } from 'react-intl';
import styled, { createGlobalStyle, css } from 'styled-components';

import useKeyBoardShortcut, { ARROW_LEFT_KEY, ARROW_RIGHT_KEY } from '../lib/hooks/useKeyboardKey';
import { imagePreview } from '../lib/image-utils';

import { Box, Flex } from './Grid';
import Loading from './LoadingPlaceholder';
import { fadeIn } from './StyledKeyframes';
import StyledTooltip from './StyledTooltip';
import UploadedFilePreview from './UploadedFilePreview';

const PDFViewer = dynamic(() => import('./PDFViewer'), {
  ssr: false,
  loading: () => <Loading />,
});

const GlobalModalStyle = createGlobalStyle`
  body {
    overflow: hidden;
  }
`;

const Header = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 3500;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.65) 25%, transparent 100%);
  height: 74px;
  padding: 16px;
`;

const ContentWrapper = styled.div`
  max-width: 100%;
  width: 100%;
  justify-content: center;
  display: flex;
`;

const Content = styled.div`
  max-width: 100%;
  z-index: 3000;
`;

const Scroller = styled.div`
  padding: 64px 16px;
  overflow-y: auto;
  max-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const ModalOverlay = styled.button`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 2500;
  display: block;
  animation: ${fadeIn} 0.25s;
  will-change: opacity;
`;

type WrapperProps = {
  zindex?: number;
};

const Wrapper = styled(Flex)<WrapperProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: ${props => props.zindex || 3000};

  justify-content: center;
  align-items: center;
`;

const StyledArrowButton = styled.button<{
  disabled?: boolean;
  direction?: 'left' | 'right';
}>`
  outline: none;
  color: white;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  position: absolute;
  z-index: 3001;
  border-radius: 999px;
  height: 40px;
  width: 40px;
  margin: 16px;
  cursor: pointer;

  display: ${props => (props.disabled ? 'none' : 'block')};
  ${props =>
    props.direction &&
    css`
      position: absolute;

      ${props.direction === 'left' ? 'left: 0' : 'right: 0'};
    `}
  &:hover {
    background: ${themeGet('colors.primary.700')};
  }
  &:focus {
    background: ${themeGet('colors.primary.700')};
  }
`;

const Button = styled.button`
  color: white;
  border: none;
  outline: none;
  background: transparent;
  z-index: 3000;
  padding: 8px;
  border-radius: 99px;
  &:hover {
    background: black;
    color: white;
  }
  &:focus-visible {
    background: black;
    color: white;
  }
  cursor: pointer;
`;

const ButtonLink = styled.a`
  display: block;
  color: white;
  border: none;
  outline: none;
  background: transparent;
  z-index: 3000;
  padding: 8px;
  border-radius: 99px;

  &:hover {
    background: black;
    color: white;
  }

  &:focus-visible {
    background: black;
    color: white;
  }
  cursor: pointer;
`;

const StyledImg = styled.img`
  width: 100%;
`;

FilesViewerModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  parentTitle: PropTypes.string,
  /** Specifies what file url to open first (opens first if undefined) */
  openFileUrl: PropTypes.string,
  files: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      name: PropTypes.string,
    }),
  ),
};

const getFileName = url => {
  const parts = url?.split('/');
  return parts[parts?.length - 1];
};

const getFileTitle = file => {
  if (!file) {
    return null;
  } else if (file.name) {
    return file.name;
  } else if (file.description) {
    return file.description;
  } else {
    return getFileName(file?.url);
  }
};

export default function FilesViewerModal({ onClose, parentTitle, files, openFileUrl }) {
  const intl = useIntl();
  const initialIndex = openFileUrl ? files?.findIndex(f => f.url === openFileUrl) : 0;
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  const onArrowLeft = React.useCallback(() => setSelectedIndex(selectedIndex => Math.max(selectedIndex - 1, 0)), []);
  const onArrowRight = React.useCallback(
    () => setSelectedIndex(selectedIndex => Math.min(selectedIndex + 1, (files?.length || 1) - 1)),
    [files],
  );
  useKeyBoardShortcut({ callback: onArrowRight, keyMatch: ARROW_RIGHT_KEY });
  useKeyBoardShortcut({ callback: onArrowLeft, keyMatch: ARROW_LEFT_KEY });

  const selectedItem = files?.length ? files[selectedIndex] : null;
  const nbFiles = files?.length || 0;
  const hasMultipleFiles = nbFiles > 1;
  const contentWrapperRef = React.useRef(null);

  const renderFile = ({ url, info, file }, contentWrapperRef) => {
    let content = null;
    const isText = endsWith(url, 'csv') || endsWith(url, 'txt');
    const isPdf = endsWith(url, 'pdf');
    const alt = getFileTitle(selectedItem);

    if (isText) {
      content = <UploadedFilePreview url={url} alt={alt} />;
    } else if (isPdf) {
      content = <PDFViewer pdfUrl={url} contentWrapperRef={contentWrapperRef} />;
    } else {
      // Attached files can have `info` object, expense items a `file` object
      const { width: imageWidth } = info || file || {};
      const maxWidth = 1200;
      const resizeWidth = Math.min(maxWidth, imageWidth ?? maxWidth);
      content = <StyledImg src={imagePreview(url, null, { width: resizeWidth })} alt={alt} />;
    }

    return <Content>{content}</Content>;
  };

  const modal = (
    <React.Fragment>
      <GlobalModalStyle />

      <FocusTrap>
        <Wrapper
          tabIndex={0}
          onKeyDown={event => {
            if (event.key === 'Escape') {
              event.preventDefault();
              event.stopPropagation();
              onClose();
            }
          }}
        >
          <ModalOverlay tabIndex={-1} onClick={onClose} />

          <Header>
            <Box px={2}>
              <span>
                {parentTitle ? (
                  <span style={{ opacity: '70%' }}>
                    {parentTitle}{' '}
                    {hasMultipleFiles && (
                      <span>
                        {selectedIndex + 1} of {nbFiles}
                      </span>
                    )}{' '}
                    /{' '}
                  </span>
                ) : null}

                <span>{getFileTitle(selectedItem)}</span>
              </span>
            </Box>
            <Flex alignItems="center" gridGap={2}>
              <StyledTooltip
                containerCursor="pointer"
                noArrow
                content={intl.formatMessage({ defaultMessage: 'Download' })}
                delayHide={0}
              >
                <ButtonLink
                  href={`/download-file?url=${encodeURIComponent(selectedItem?.url)}`}
                  download={getFileName(selectedItem?.url)}
                  target="_blank"
                >
                  <ArrowDownTray size={24} />
                </ButtonLink>
              </StyledTooltip>
              <StyledTooltip
                containerCursor="pointer"
                noArrow
                content={intl.formatMessage({ defaultMessage: 'Open in new window' })}
                delayHide={0}
              >
                <ButtonLink href={selectedItem?.url} target="_blank">
                  <ArrowTopRightOnSquare size={24} />
                </ButtonLink>
              </StyledTooltip>
              <StyledTooltip
                containerCursor="pointer"
                noArrow
                content={intl.formatMessage({ defaultMessage: 'Close' })}
                delayHide={0}
              >
                <Button onClick={onClose}>
                  <XMark size="24" aria-hidden="true" />
                </Button>
              </StyledTooltip>
            </Flex>
          </Header>
          {hasMultipleFiles && (
            <React.Fragment>
              <StyledArrowButton direction="left" onClick={onArrowLeft} disabled={!selectedIndex}>
                <ChevronLeft size={24} />
              </StyledArrowButton>

              <StyledArrowButton
                direction="right"
                onClick={onArrowRight}
                disabled={!nbFiles || selectedIndex === nbFiles - 1}
              >
                <ChevronRight size={24} />
              </StyledArrowButton>
            </React.Fragment>
          )}
          <Scroller>
            <ContentWrapper ref={contentWrapperRef}>
              {selectedItem && renderFile(selectedItem, contentWrapperRef)}
            </ContentWrapper>
          </Scroller>
        </Wrapper>
      </FocusTrap>
    </React.Fragment>
  );
  if (typeof document !== 'undefined') {
    return createPortal(modal, document.body);
  } else {
    return null;
  }
}
