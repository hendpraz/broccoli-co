import { useState } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Modal } from "./components/Modal";
import { Form } from "./components/Form";

function App() {
  const [shouldShowModal, setShouldShowModal] = useState(false);

  const handleRequestClick = () => {
    setShouldShowModal(true);
  };

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-gray-100">
        <div className="m-auto">
          <div className="font-mono text-4xl text-center font-semibold">
            <p>A better way</p>
            <p>to enjoy every day.</p>
          </div>

          <div className="font-mono text-center text-lg mt-8">
            <p> Be the first to know when we launch</p>
          </div>

          <div className="flex justify-center mt-8">
            <button
              className="px-4 py-4 border-1 font-mono cursor-pointer hover:bg-gray-200"
              onClick={handleRequestClick}
            >
              Request an invite
            </button>
          </div>

          <Modal
            isOpen={shouldShowModal}
            onClose={() => setShouldShowModal(false)}
          >
            <Form onClose={() => setShouldShowModal(false)} />
          </Modal>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;
