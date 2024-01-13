export enum ErrorCode {
  InvalidEmailOrPassword = "invalid_email_or_password",
  InternalServerError = "internal_server_error",
  EmailAndPasswordAreRequired = "email_and_password_are_required",

  //TODO: provide translation for these errors
  IncorrectPassword = "incorrect_password",
  NewPasswordMatchesOld = "new_password_matches_old",
}
