import { apiRequest } from './api';

/**
 * getContacts() — fetch all users (excluding self) as potential contacts
 */
export const getContacts = () => apiRequest('/users');

/**
 * getMessages(contactId) — fetch message history between self and a contact
 */
export const getMessages = (contactId) =>
  apiRequest(`/messages?contactId=${contactId}`);
