import React from 'react';

export const Visitor = ({ id, name, notes, status, signOutVisitor }) => {
  return (
    <tr>
      <td className="p-2 border-t border-grey-light font-mono ">{name}</td>
      <td className="p-2 border-t border-grey-light font-mono">{notes}</td>
      <td className="p-1 border-t border-grey-light font-mono">
        {status == null ? (
          <button
            className="border border-black rounded p-1"
            onClick={event => signOutVisitor(id, event)}
          >
            Sign Out
          </button>
        ) : (
          status
        )}
      </td>
    </tr>
  );
};

export const VisitorList = ({ visitors, signOutVisitor }) => {
  return (
    <div className="flex-grow h-screen overflow-y-scroll">
      <div className="mx-auto">
        <div className="mt-8">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">
                  Name
                </th>
                <th className="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">
                  Notes
                </th>
                <th className="text-sm font-semibold text-grey-darker p-1 bg-grey-lightest">
                  Signed out
                </th>
              </tr>
            </thead>
            <tbody className="align-baseline">
              {visitors.length
                ? visitors.map(visitor => {
                    const {
                      id,
                      attributes: { name, notes, sign_out: status },
                    } = visitor;
                    return (
                      <Visitor
                        key={`visitor-${id}`}
                        id={id}
                        name={name}
                        notes={notes}
                        status={status}
                        signOutVisitor={signOutVisitor}
                      />
                    );
                  })
                : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
