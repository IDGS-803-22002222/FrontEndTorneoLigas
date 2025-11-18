import Layout from "../components/Layout";

const Home = () => {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-4xl font-black text-gray-900 mb-8">Dashboard</h2>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <p className="text-gray-700 text-lg">
            Bienvenido al sistema de gestión de torneos.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
