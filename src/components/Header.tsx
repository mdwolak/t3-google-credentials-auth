import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

import { Spinner } from "~/components/core/Spinner";
import CreateExemplarModal from "~/components/exemplars/create.exemplar.modal";
import Modal from "~/components/modals/modal";

const Header = () => {
  const [openModal, setOpenModal] = useState(false);
  const { data: sessionData } = useSession();
  const user = sessionData?.user;

  return (
    <>
      <header className="h-20 bg-white">
        <nav className="container flex h-full items-center justify-between">
          <div>
            <Link href="/" className="text-ct-dark-600 text-2xl font-semibold">
              Example
            </Link>
          </div>
          <ul className="flex items-center gap-4">
            <li>
              <Link href="/" className="text-ct-dark-600">
                Home
              </Link>
            </li>
            {!user && (
              <>
                <li>
                  <Link href="/register" className="text-ct-dark-600">
                    SignUp
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signin" className="text-ct-dark-600">
                    Login
                  </Link>
                </li>
              </>
            )}
            {user && (
              <>
                <li>
                  <Link href="/profile" className="text-ct-dark-600">
                    Profile
                  </Link>
                </li>
                <li className="cursor-pointer" onClick={() => setOpenModal(true)}>
                  Create Exemplar
                </li>
                {/* <li className="cursor-pointer" onClick={handleLogout}>
                  Logout
                </li> */}
                <li
                  className="cursor-pointer"
                  onClick={sessionData ? () => signOut() : () => signIn()}>
                  {sessionData ? "Sign out" : "Sign in"}
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <Modal openModal={openModal} setOpenModal={setOpenModal}>
        <CreateExemplarModal setOpenModal={setOpenModal} />
      </Modal>
      <div className="bg-ct-blue-600 fixed pl-2 pt-4">{<Spinner />}</div>
    </>
  );
};

export default Header;
