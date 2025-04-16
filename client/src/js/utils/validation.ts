// @ts-ignore
import JustValidate from 'just-validate';

const validation = () => {
  //   let userData;
  const validator = new JustValidate('#modal-form');
  validator
    .addField(document.querySelector('#username'), [
      {
        rule: 'required',
        errorMessage: 'Это поле обязательно для заполнения',
      },
      {
        rule: 'minLength',
        value: 3,
        errorMessage: 'Имя должно быть не менее 3 букв',
      },
      {
        rule: 'maxLength',
        value: 15,
        errorMessage: 'Имя должно быть не более 15 букв',
      },
    ])
    .addField('#password', [
      {
        rule: 'required',
      },
    ])
    .addField('#password-verification', [
      {
        rule: 'required',
      },
      {
        validator: (value: string, fields: any) => {
          if (fields['#password'] && fields['#password'].elem) {
            const repeatPasswordValue = fields['#password'].elem.value;

            return value === repeatPasswordValue;
          }

          return true;
        },
        errorMessage: 'Пароли должны быть одинаковыми',
      },
    ]);
  // .onSuccess(async function (e: Event) {
  //   let formData = new FormData(e.target as HTMLFormElement);
  //   const data: Record<string, FormDataEntryValue> = {};
  //   for (let [key, value] of formData) {
  //     data[key] = value;
  //   }
  //   const { username, password } = data;
  //   if (typeof username === 'string' && typeof password === 'string') {
  //     return (userData = { username, password });
  //   }
  // });
  //   return userData;
};

export default validation;
