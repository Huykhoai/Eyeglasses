
export const useBase64 = () => {
    const encode = (key: any) => {
        if (!key) return null;
        try {
            return btoa(JSON.stringify(key));
        } catch (error) {
            return null;
        }
    }
    const decode = (key: any) => {
        if (!key) return null;

        try {
            return JSON.parse(atob(key));
        } catch (error) {
            return null;
        }
    }
    return { encode, decode };
}