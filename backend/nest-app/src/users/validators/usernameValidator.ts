import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsUsernameValidConstraint implements ValidatorConstraintInterface {
  validate(username: string): boolean {
    // Regular expression to enforce the username rules
    const regex = /^(?![0-9])(?!.*[!@#$%^&*()_+=[\]{};':"\\|,.<>/?-]$)(?!.*[!@#$%^&*()_+=[\]{};':"\\|,.<>/?-]{2,})(?!.*[0-9]{2,})[a-zA-Z0-9_]+$/;
    return regex.test(username);
  }

  defaultMessage(): string {
    return 'Invalid Username';
  }
}

export function IsUsernameValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUsernameValidConstraint,
    });
  };
}