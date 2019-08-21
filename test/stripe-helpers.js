/** See https://stripe.com/docs/testing#cards */

export const generateValidCard = code => ({
  creditCardNumber: code,
  expirationDate: '1250',
  cvcCode: '123',
  postalCode: '42222',
});

export const CreditCards = {
  CARD_DEFAULT: generateValidCard('4242424242424242'),
  CARD_3D_SECURE: generateValidCard('4000000000003063'),
  CARD_3D_SECURE_2: generateValidCard('4000000000003220'),
  CARD_3D_SECURE_DECLINED: generateValidCard('4000008400001629'),
};
