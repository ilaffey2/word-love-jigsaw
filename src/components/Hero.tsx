// import required dependencies
import { InfoCircledIcon } from "@radix-ui/react-icons";

const Hero = () => {
  return (
    <div className="flex flex-col items-center text-center bg-rose-100 rounded-md p-6 my-8">
      <p className="text-xl md:text-2xl text-rose-900 mb-2">
        Find out how well you and your partner match up in the world of text
        embeddings!
      </p>
      <p className="text-md text-rose-800">
        Our love calculator uses a technique called{" "}
        <strong>textual embeddings</strong> — a form of word association magic
        that maps words into a high-dimensional space. When two names are
        inputted, our smart algorithm quantifies how close these names are in
        this magical space, essentially measuring the{" "}
        <strong>&quot;similarity&quot;</strong> between them.
      </p>

      <div className="flex items-center justify-center mt-4 text-sm text-rose-600">
        <InfoCircledIcon className="mr-2" />
        <span>
          Inspired by the word-emotion-shapes project by Simón Fishman.
        </span>
      </div>
    </div>
  );
};

export default Hero;
