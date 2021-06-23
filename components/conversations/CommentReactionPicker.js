import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import { Manager, Popper, Reference } from 'react-popper';
import styled, { css } from 'styled-components';

import { API_V2_CONTEXT, gqlV2 } from '../../lib/graphql/helpers';
import useGlobalBlur from '../../lib/hooks/useGlobalBlur';

import { Flex } from '../Grid';
import AddReactionIcon from '../icons/AddReactionIcon';
import StyledButton from '../StyledButton';
import StyledCard from '../StyledCard';
import StyledRoundButton from '../StyledRoundButton';

const addReactionMutation = gqlV2/* GraphQL */ `
  mutation AddEmojiReaction($emoji: String!, $update: UpdateReferenceInput, $comment: CommentReferenceInput) {
    addEmojiReaction(emoji: $emoji, update: $update, comment: $comment) {
      update {
        id
        reactions
        userReactions
      }
      comment {
        id
        reactions
        userReactions
      }
    }
  }
`;

const removeReactionMutation = gqlV2/* GraphQL */ `
  mutation RemoveEmojiReaction($emoji: String!, $update: UpdateReferenceInput, $comment: CommentReferenceInput) {
    removeEmojiReaction(emoji: $emoji, update: $update, comment: $comment) {
      update {
        id
        reactions
        userReactions
      }
      comment {
        id
        reactions
        userReactions
      }
    }
  }
`;

const Emoji = styled.div`
  font-size: 15px;
`;

const ReactionButton = styled(StyledRoundButton).attrs({ isBorderless: true, buttonSize: 'small' })`
  margin: 4px;
  background: white !important;

  ${Emoji} {
    transition: transform 0.15s cubic-bezier(0.2, 0, 0.13, 2);
  }

  &:hover {
    ${Emoji} {
      transform: scale(1.3);
    }
  }

  ${props =>
    props.isSelected &&
    css`
      background: ${props.theme.colors.primary[200]} !important;
    `}
`;

const getOptimisticResponse = (entity, emoji, isAdding, isComment) => {
  const userReactions = entity.userReactions || [];
  if (isAdding) {
    const newCount = (entity.reactions[emoji] || 0) + 1;

    let entityObj;
    if (isComment) {
      entityObj = {
        comment: {
          __typename: entity.__typename,
          id: entity.id,
          reactions: { ...entity.reactions, [emoji]: newCount },
          userReactions: [...userReactions, emoji],
        },
      };
    } else {
      entityObj = {
        update: {
          __typename: entity.__typename,
          id: entity.id,
          reactions: { ...entity.reactions, [emoji]: newCount },
          userReactions: [...userReactions, emoji],
        },
      };
    }

    return {
      __typename: 'Mutation',
      addEmojiReaction: {
        __typename: 'addEmojiReaction',
        ...entityObj,
      },
    };
  } else {
    const newCount = (entity.reactions[emoji] || 0) - 1;
    const reactions = { ...entity.reactions, [emoji]: newCount };

    if (!reactions[emoji]) {
      delete reactions[emoji];
    }

    let entityObj;
    if (isComment) {
      entityObj = {
        comment: {
          __typename: entity.__typename,
          id: entity.id,
          reactions,
          userReactions: userReactions.filter(userEmoji => userEmoji !== emoji),
        },
      };
    } else {
      entityObj = {
        update: {
          __typename: entity.__typename,
          id: entity.id,
          reactions,
          userReactions: userReactions.filter(userEmoji => userEmoji !== emoji),
        },
      };
    }

    return {
      __typename: 'Mutation',
      removeEmojiReaction: {
        __typename: 'removeEmojiReaction',
        ...entityObj,
      },
    };
  }
};

const mutationOptions = { context: API_V2_CONTEXT };

/**
 * A component to render the reaction picker on comments.
 */
const CommentReactionPicker = ({ comment, update }) => {
  const emojiFirstRow = ['👍️', '👎', '😀', '🎉'];
  const emojiSecondRow = ['😕', '❤️', '🚀', '👀'];
  const [open, setOpen] = React.useState(false);
  const wrapperRef = React.useRef();
  const [addReaction] = useMutation(addReactionMutation, mutationOptions);
  const [removeReaction] = useMutation(removeReactionMutation, mutationOptions);

  useGlobalBlur(wrapperRef, outside => {
    if (outside) {
      setOpen(false);
    }
  });

  const getReactionBtnProps = emoji => {
    let isSelected;
    if (comment) {
      isSelected = comment.userReactions?.includes(emoji);
    } else if (update) {
      isSelected = update.userReactions?.includes(emoji);
    }
    return {
      children: <Emoji>{emoji}</Emoji>,
      isSelected,
      onClick: () => {
        setOpen(false);
        const action = isSelected ? removeReaction : addReaction;
        if (comment) {
          return action({
            variables: { emoji: emoji, comment: { id: comment.id } },
            optimisticResponse: getOptimisticResponse(comment, emoji, !isSelected, true),
          });
        } else if (update) {
          return action({
            variables: { emoji: emoji, update: { id: update.id } },
            optimisticResponse: getOptimisticResponse(update, emoji, !isSelected, false),
          });
        }
      },
    };
  };

  return (
    <Manager>
      <div ref={wrapperRef}>
        <Reference>
          {({ ref }) => (
            <StyledButton
              buttonSize="tiny"
              display="inline-block"
              whiteSpace="nowrap"
              onClick={() => setOpen(true)}
              ref={ref}
              margin="4px 8px 4px 0"
              data-cy="comment-reaction-picker-trigger"
            >
              <AddReactionIcon />
            </StyledButton>
          )}
        </Reference>
        {open && (
          <Popper placement="bottom">
            {({ placement, ref, style }) => (
              <StyledCard
                boxShadow="-2px -1px 3px 0px #e8e8e8"
                zIndex={9999}
                data-placement={placement}
                ref={ref}
                style={style}
                data-cy="comment-reaction-picker-popper"
              >
                <Flex>
                  {emojiFirstRow.map(emoji => (
                    <ReactionButton key={emoji} {...getReactionBtnProps(emoji)} />
                  ))}
                </Flex>
                <Flex>
                  {emojiSecondRow.map(emoji => (
                    <ReactionButton key={emoji} {...getReactionBtnProps(emoji)} />
                  ))}
                </Flex>
              </StyledCard>
            )}
          </Popper>
        )}
      </div>
    </Manager>
  );
};

CommentReactionPicker.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    html: PropTypes.string,
    createdAt: PropTypes.string,
    fromCollective: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
    userReactions: PropTypes.array,
  }),
  update: PropTypes.shape({
    id: PropTypes.string.isRequired,
    html: PropTypes.string,
    createdAt: PropTypes.string,
    fromAccount: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
    userReactions: PropTypes.array,
  }),
};

export default CommentReactionPicker;
