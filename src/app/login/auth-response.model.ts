// auth-response.model.ts
export interface AuthResponse {
  token: string;
  userExists?: {
    id: string;
    email: string;
    name: string;
    // Adicione outros campos conforme necessário
  };
}
