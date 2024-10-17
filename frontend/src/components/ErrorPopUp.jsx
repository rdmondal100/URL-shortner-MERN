// ErrorPopUp.jsx
import { useSelector, useDispatch } from 'react-redux';
import { clearErrorMessage ,setErrorMessage } from '../store/urlSlice';
import { BiSolidErrorAlt } from "react-icons/bi";

const ErrorPopUp = () => {
  const dispatch = useDispatch();
  const {errorMessage,isLoading} = useSelector((state) => state.urlData);

  const handleClose = () => {
    dispatch(clearErrorMessage());
  };

  if (!errorMessage) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg p-6 max-w-sm w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-red-600 flex items-center gap-1"><BiSolidErrorAlt/>Error</h2>
          <button onClick={handleClose} className="text-muted-foreground hover:text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="mt-4 text-muted-foreground">{errorMessage}</p>
        <button
          onClick={handleClose}
          className="mt-4 w-full bg-red-600 text-white rounded-md py-2 hover:bg-red-700 transition duration-200"
        >
          Close
        </button>
      </div>
      <div className="absolute -z-10 inset-0 bg-black opacity-50"></div>
    </div>
  );
};

export default ErrorPopUp;
