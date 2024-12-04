import React from 'react';

const plainFnMock = () => 1;

export const ScalprumComponent = ({ scope, module }: { scope: string; module: string }) => {
  <div>
    Fake {scope} UI {module} component
  </div>;
};

export const useScalprum = plainFnMock;
