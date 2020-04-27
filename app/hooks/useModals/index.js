import { useContext } from 'react';
import ModelsManager from 'Modals/Manager';

const useModals = () => useContext(ModelsManager.Context);

export default useModals;
