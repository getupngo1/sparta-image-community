export const emailCheck = (email) => {
    // aa_-.123Aaa@my-companyaa.com 이런식

      //^는 첫 글자만 *은 여러개 들어온다
      let _reg = /^[0-9a-zA-Z][-_.0-9a-zA-Z]*@[0-9a-zA-Z]([-_.0-9a-zA-Z])*.([a-zA-z])*/;

      console.log(_reg.test(email));
      return _reg.test(email);
}