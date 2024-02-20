import React, { Children, ReactNode, isValidElement } from 'react';

interface ShowElementProps {
    isTrue?: boolean;
    render?: boolean;
    children: ReactNode;
}

interface ShowElementComponent extends React.FC<ShowElementProps> {
    when: ({ isTrue, children }: ShowElementProps) => ReactNode;
    else: ({ render, children }: ShowElementProps) => ReactNode;
}

const ShowElement: ShowElementComponent = ({ children }) => {
    let when: ReactNode | null = null;
    let otherwise: ReactNode | null = null;

    Children.forEach(children, (child) => {
        if (isValidElement(child)) {
            const { isTrue } = child.props;
            if (isTrue === undefined) {
                otherwise = child;
            } else if (!when && isTrue === true) {
                when = child;
            }
        }
    });

    return when || otherwise;
};

ShowElement.when = ({ isTrue, children }) => isTrue && children;
ShowElement.else = ({ render, children }) => render && children;

export default ShowElement;