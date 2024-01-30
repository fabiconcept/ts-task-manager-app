import { getSessionData } from "..";

export const retrieveActiveSession = () : [boolean, string | null] => {
    let sessionIdString: string | null = null;
    let hasSession = true
    const sessionId = getSessionData("taskerId");
    
    if (!sessionId) {
        hasSession = false;
        sessionIdString = "";
    }else{
        sessionIdString = sessionId;
    }



    return [hasSession, sessionIdString];
}