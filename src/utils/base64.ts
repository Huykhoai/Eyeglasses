
export const useBase64 = () => {
    const encode = (key: any) => {
        if (key === undefined || key === null) return null;
        try {
            return btoa(String(key));
        } catch (error) {
            return null;
        }
    }
    const decode = (key: any) => {
        if (!key) return null;

        try {
            return atob(key);
        } catch (error) {
            return null;
        }
    }
    return { encode, decode };
}