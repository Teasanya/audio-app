// class AuthView {
//     constructor() {
//         this.app = document.getElementById('app');
//         this.formTitle = document.createElement('h2');
//         this.usernameInput = document.createElement('input');
//         this.passwordInput = document.createElement('input');
//         this.submitButton = document.createElement('button');
//         this.toggleLink = document.createElement('a');
//         this.errorElement = document.createElement('div');
//     }

//     renderLoginForm() {
//         this.app.innerHTML = '';

//         const formContainer = document.createElement('div');
//         formContainer.className = 'form-container';

//         this.formTitle.textContent = 'Login';

//         const form = document.createElement('form');
//         form.id = 'auth-form';

//         const usernameGroup = this.createFormGroup('Username', this.usernameInput);
//         const passwordGroup = this.createFormGroup('Password', this.passwordInput);
//         this.passwordInput.type = 'password';

//         this.submitButton.textContent = 'Login';

//         const toggleDiv = document.createElement('div');
//         toggleDiv.className = 'toggle-form';
//         toggleDiv.textContent = 'Don\'t have an account? ';
//         this.toggleLink.textContent = 'Register';
//         toggleDiv.appendChild(this.toggleLink);

//         this.errorElement.className = 'error';

//         form.append(usernameGroup, passwordGroup, this.submitButton, this.errorElement);
//         formContainer.append(this.formTitle, form, toggleDiv);
//         this.app.appendChild(formContainer);
//     }

//     renderRegisterForm() {
//         this.app.innerHTML = '';

//         const formContainer = document.createElement('div');
//         formContainer.className = 'form-container';

//         this.formTitle.textContent = 'Register';

//         const form = document.createElement('form');
//         form.id = 'auth-form';

//         const usernameGroup = this.createFormGroup('Username', this.usernameInput);
//         const passwordGroup = this.createFormGroup('Password', this.passwordInput);
//         this.passwordInput.type = 'password';

//         this.submitButton.textContent = 'Register';

//         const toggleDiv = document.createElement('div');
//         toggleDiv.className = 'toggle-form';
//         toggleDiv.textContent = 'Already have an account? ';
//         this.toggleLink.textContent = 'Login';
//         toggleDiv.appendChild(this.toggleLink);

//         this.errorElement.className = 'error';

//         form.append(usernameGroup, passwordGroup, this.submitButton, this.errorElement);
//         formContainer.append(this.formTitle, form, toggleDiv);
//         this.app.appendChild(formContainer);
//     }

//     createFormGroup(labelText, inputElement) {
//         const group = document.createElement('div');
//         group.className = 'form-group';

//         const label = document.createElement('label');
//         label.textContent = labelText;

//         group.append(label, inputElement);
//         return group;
//     }

//     showError(message) {
//         this.errorElement.textContent = message;
//     }

//     clearForm() {
//         this.usernameInput.value = '';
//         this.passwordInput.value = '';
//         this.errorElement.textContent = '';
//     }

//     bindLogin(handler) {
//         this.submitButton.addEventListener('click', (e) => {
//             e.preventDefault();
//             const username = this.usernameInput.value;
//             const password = this.passwordInput.value;
//             handler(username, password);
//         });
//     }

//     bindRegister(handler) {
//         this.submitButton.addEventListener('click', (e) => {
//             e.preventDefault();
//             const username = this.usernameInput.value;
//             const password = this.passwordInput.value;
//             handler(username, password);
//         });
//     }

//     bindToggleForm(handler) {
//         this.toggleLink.addEventListener('click', (e) => {
//             e.preventDefault();
//             handler();
//         });
//     }
// }

// class AuthController {
//     constructor(model, view) {
//         this.model = model;
//         this.view = view;

//         this.view.bindToggleForm(this.handleToggleForm.bind(this));

//         if (this.model.isLoginForm) {
//             this.view.renderLoginForm();
//             this.view.bindLogin(this.handleLogin.bind(this));
//         } else {
//             this.view.renderRegisterForm();
//             this.view.bindRegister(this.handleRegister.bind(this));
//         }
//     }

//     async handleLogin(username, password) {
//         if (!username || !password) {
//             this.view.showError('Please fill in all fields');
//             return;
//         }

//         const result = await this.model.login(username, password);
//         if (result.success) {
//             alert(Welcome back, ${username}!);
//             this.view.clearForm();
//             // Здесь можно перенаправить на другую страницу
//         } else {
//             this.view.showError(result.message);
//         }
//     }

//     handleRegister(username, password) {
//         if (!username || !password) {
//             this.view.showError('Please fill in all fields');
//             return;
//         }

//         const result = this.model.register(username, password);
//         if (result.success) {
//             alert(Registration successful! Welcome, ${username});
//             this.model.isLoginForm = true;
//             this.view.renderLoginForm();
//             this.view.bindLogin(this.handleLogin.bind(this));
//             this.view.clearForm();
//         } else {
//             this.view.showError(result.message);
//         }
//     }

//     handleToggleForm() {
//         this.model.toggleForm();
//         if (this.model.isLoginForm) {
//             this.view.renderLoginForm();
//             this.view.bindLogin(this.handleLogin.bind(this));
//         } else {
//             this.view.renderRegisterForm();
//             this.view.bindRegister(this.handleRegister.bind(this));
//         }
//         this.view.bindToggleForm(this.handleToggleForm.bind(this));
//     }
// }
// TrackController.ts
// class TrackController {
//     private currentTrackId: number = 0;
//     private tracks: Data = [];

//     constructor(private view: AudioPlayerView) {}

//     async loadTracks(): Promise<void> {
//       try {
//         // Здесь ваш асинхронный запрос за данными
//         this.tracks = await fetchTracks(); // Замените на ваш метод получения данных
//         this.view.init(this.tracks);
//         this.setTrack(this.tracks[0]?.id || 0);
//       } catch (error) {
//         console.error('Failed to load tracks:', error);
//       }
//     }

//     setTrack(id: number): void {
//       const track = this.tracks.find(t => t.id === id);
//       if (track) {
//         this.currentTrackId = id;
//         this.view.renderAudio(track);
//       }
//     }

//     changeTrack(direction: 'next' | 'prev'): void {
//       const currentIndex = this.tracks.findIndex(t => t.id === this.currentTrackId);
//       if (currentIndex === -1) return;

//       const newIndex = direction === 'next'
//         ? Math.min(currentIndex + 1, this.tracks.length - 1)
//         : Math.max(currentIndex - 1, 0);

//       this.setTrack(this.tracks[newIndex].id);
//     }
//   }

// createElement(tag: string, className: string) {
//     const element = document.createElement(tag);
//     if (className) element.classList.add(className);

//     return element;
//   }

//   getElement(selector: string) {
//     const element = document.querySelector(selector);

//     return element;
//   }

// this.nextBtn.addEventListener('click', () => {
//   const id = this.audio.dataset.id;

//   if (id) {
//     const nextId = Math.min(parseInt(id) + 1, 50);
//     const audio = data.find((audio) => audio.id === nextId);
//     if (audio) {
//       this.renderAudio(audio);
//     }
//   }
// });
// this.prevBtn.addEventListener('click', () => {
//   const id = this.audio.dataset.id;
//   if (id) {
//     const nextId = Math.max(parseInt(id) - 1, 0);
//     const audio = data.find((audio) => audio.id === nextId);
//     if (audio) {
//       this.renderAudio(audio);
//     }
//   }
// })
