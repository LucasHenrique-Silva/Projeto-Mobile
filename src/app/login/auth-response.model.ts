// auth-response.model.ts
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    // Adicione outros campos conforme necessário
  };
}
