const getFormData = (e: Event) => {
  e.preventDefault();
  let formData = new FormData(e.target as HTMLFormElement);
  const credentials = {
    username: formData.get('username'),
    password: formData.get('password'),
  };
  const { username, password } = credentials;
  if (typeof username === 'string' && typeof password === 'string') {
    return { username, password };
  } else {
    return { username: '', password: '' };
  }
};

export default getFormData;
