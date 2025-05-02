
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-rental-DEFAULT">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">MotoLocadora Manager</h1>
        <p className="text-xl">Carregando o sistema...</p>
      </div>
    </div>
  );
};

export default Index;