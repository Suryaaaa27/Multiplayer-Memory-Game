export function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser')) || { name: 'Guest', email: '' };
}

export function saveUser(name, email) {
  const user = { name, email };
  localStorage.setItem('currentUser', JSON.stringify(user));
}

export function logoutUser() {
  localStorage.removeItem('currentUser');
}
