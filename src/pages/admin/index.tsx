import { useRef, useState } from "react";

import { ConfirmDelete } from "~/components/dialogs/ConfirmDelete";

export default function Example() {
  const [open, setOpen] = useState(true);

  const cancelButtonRef = useRef(null);

  return (
    <>
      <button onClick={() => setOpen(true)}>Click</button>
      <ConfirmDelete
        open={open}
        handleClose={(data) => {
          alert(data);
          setOpen(false);
        }}
        title="Delete exemplar"
        description="Are you sure you want to delete this exemplar? This action cannot be undone."
      />
    </>
  );
}
