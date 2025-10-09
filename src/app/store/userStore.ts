import { create } from "zustand";

// Tipos para los estados
interface User {
    apellidoMaterno: string;
    apellidoPaterno: string;
    documentoUsuario: string;
    historico: string;
    membresia: string;
    nombres: string;
    email: string;
    password: string;
    repeticionUsuario: string;
    role: string;
    statusActive: string;
    userType: string;
    _id: string;
    direccion: string;
    distrito: string;
    provincia: string;
    departamento: string;
    celular: string;
    membresia500: string;
    menbresia200: string;
}

interface Config {
    precioKiloHuevos: string;
    proyecto: string;
    // Agrega aquí las propiedades reales de tu configuración
}

// 1️⃣ Store de usuario
interface UserStore {
    user: User | null;
    loading: boolean;
    setUser: (userData: User | null) => void;
    setLoading: (state: boolean) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    loading: false,
    setUser: (userData) => set({ user: userData }),
    setLoading: (state) => set({ loading: state }),
}));

// 2️⃣ Store de configuración
interface ConfigStore {
    config: Config | null;
    setConfig: (configData: Config | null) => void;
}

export const useConfigStore = create<ConfigStore>((set) => ({
    config: null,
    setConfig: (configData) => set({ config: configData }),
}));
