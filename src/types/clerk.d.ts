interface Clerk {
    session?: {
        getToken: () => Promise<string | null>
    }
}

declare interface Window {
    Clerk: Clerk
}
