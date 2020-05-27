import useModals from 'Hooks/useModals';
import { useRouter } from 'next/router';

const Event = () => {
  const { event_id_or_slug } = useRouter().query;
  const Modals = useModals();

  //Unable to open a modal here also componentDidMount dont work here also tried using a button just for testing still its not working

  return (
    <>
      <div className="text-center">Event Page</div>
    </>
  );
};

export default Event;
