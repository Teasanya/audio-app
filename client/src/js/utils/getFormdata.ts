const getFormData = async (
  e: Event,
  handler: (username: string, password: string) => void
) => {
  e.preventDefault();
  console.log('getdata');
  let formData = new FormData(e.target as HTMLFormElement);
  const credentials = {
    username: formData.get('username'),
    password: formData.get('password'),
  };
  const { username, password } = credentials;
  if (typeof username === 'string' && typeof password === 'string') {
    await handler(username, password);
  }
};

export default getFormData;
