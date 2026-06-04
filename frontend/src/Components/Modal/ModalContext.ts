import { createContext } from 'react';

interface ModalContextValue {
  titleId?: string;
}

const ModalContext = createContext<ModalContextValue>({});

export default ModalContext;
