export class User {
  name: string;
  email: string;
  senha: string;
  senha2: string;
  class?: {
    class: number;
  };
  covid?: {
    covid: number;
    transp: number;
    risco: number;
    sintomas: number;
    teve: number;
    rangeMask: number;
    rangeAlcool: number;
    rangeLavam: number;
    rangeDist: number;
    rangeSocial: number;
    rangeMedo: number;
    rangePessoas: number;
    rangeFamilia: number;
  }
}