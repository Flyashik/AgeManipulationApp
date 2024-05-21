import {AuthChangeEvent, createClient, Session, User} from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabase = createClient('http://192.168.0.11:54321', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0');

interface UserData {
    id: string;
    email: string;
    // Добавьте другие поля, если необходимо
}

// Функция для сохранения данных пользователя в AsyncStorage
const saveUserData = async (userData: UserData) => {
    try {
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
        console.error('Ошибка сохранения данных пользователя:', error);
    }
};

// Функция для регистрации нового пользователя
const register = async (email: string, password: string): Promise<UserData | null> => {
    try {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
            console.error('Ошибка регистрации:', error.message);
            return null;
        }
        if (data?.user) {
            const userData: UserData = { id: data.user.id, email: data.user.email! };
            await saveUserData(userData); // Сохраняем данные пользователя в AsyncStorage после успешной регистрации
            return userData;
        }
        return null;
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        return null;
    }
};

// Функция для аутентификации пользователя
const login = async (email: string, password: string): Promise<UserData | null> => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            console.error('Ошибка аутентификации:', error.message);
            return null;
        }
        if (data?.user) {
            const userData: UserData = { id: data.user.id, email: data.user.email! };
            await saveUserData(userData); // Сохраняем данные пользователя в AsyncStorage после успешной аутентификации
            return userData;
        }
        return null;
    } catch (error) {
        console.error('Ошибка аутентификации:', error);
        return null;
    }
};

// Функция для проверки статуса авторизации
const checkAuthenticationStatus = async (): Promise<boolean> => {
    const session = supabase.auth.getSession();
    return session !== null;
};

// Подписка на изменения статуса авторизации и обновление данных пользователя в AsyncStorage
const setupAuthChangeSubscription = () => {
    supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
        if (event === 'SIGNED_IN' && session?.user) {
            const userData: UserData = { id: session.user.id, email: session.user.email! };
            saveUserData(userData);
        }
    });
};

export { register, login, checkAuthenticationStatus, setupAuthChangeSubscription };