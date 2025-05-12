import { emailRegex } from '~/common/regularExpressions';

describe('emailRegex', () => {
  it.each([
    ['email@domain.com', true],
    ['name.surname@domain.com', true],
    ['name.surname@domain.com', true],
    ['name_surname@domain.co.uk', true],
    ['name-surname@domain.co.uk', true],
    ['namesurname@domain.co.uk', true],
    ['[namesurname@domain.co.uk]', true],
    ['@domain', false],
    ['email@domain', false],
    ['email@domain,com', false],
    ['email@domain.c', false],
    ['emaildomain.com', false],
    ['email@domain.', false],
    ['name@domain.11', false],
  ])(`value "%s" is matched: %s`, (value: string, matched: boolean) => {
    if (matched) {
      expect(value).toMatch(emailRegex);
    } else {
      expect(value).not.toMatch(emailRegex);
    }
  });
});
