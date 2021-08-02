export class User {
  constructor(
      public userID: number,
      public email: string,
      public firstName: string,
      public lastName: string,
      public roleId: number,
      public companyId: number,
      public _token: string) {}

  // get token() {
  //     return this._token;
  // }
}
