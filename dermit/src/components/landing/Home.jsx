import React from "react";

const Home = () => {
  return (
    <>
      <section className="min-h-screen w-full flex flex-col items-center justify-center md:px-20 px-10">
        <div className="mx-auto space-y-4 text-center md:max-w-[40%]">
          <p className="md:text-6xl text-4xl font-bold text-primaryGreen">
            Revolutionizing Dermatology with AI
          </p>
          <p className="md:text-xl text-lg font-semibold">
            Your one-stop solution for dermatological care.
          </p>
          <p className="md:text-lg">
            With emerging advancements in artificial intelligence, DermIT aims
            to provide you with a doctor-like environment right at your
            fingertips. Our platform utilizes cutting-edge AI technologies to
            offer accurate diagnoses, comprehensive reports, and personalized
            treatment recommendations.
          </p>
        </div>
      </section>

      <section className="min-h-screen w-full flex flex-col items-center justify-cente md:px-20 px-10">
        <div className="mx-auto space-y-4 text-center md:max-w-[40%]">
          <p className="md:text-6xl text-4xl font-bold text-primaryGreen">
            How it works?
          </p>
          <p className="md:text-xl text-lg font-semibold">
            Experience full diagnosis in just 4 simple steps, only possible with
            state-of-the-art multi-model AI!
          </p>
          <ol className="md:text-lg list-decimal list-inside">
            <li> Sing up and get started with diagnose me</li>
            <li> Answer a few question related to you lifestyle habits</li>
            <li> Upload images to our Computer Vision model</li>
            <li> Explain your concerns to the DermIT engine</li>

          </ol>
        </div>
      </section>
    </>
  );
};

export default Home;
