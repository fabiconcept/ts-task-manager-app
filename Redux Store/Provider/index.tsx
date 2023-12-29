import { Provider } from "react-redux"
import store from ".."
import React from "react"

const StoreProvider: React.FC<UiWithChildren> = ({ children }) => {
    return(
        <Provider store={store}>
            {children}
        </Provider>
    )
}

export default StoreProvider;