import { useState } from "react";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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", // Replace with your OpenAI API key
  dangerouslyAllowBrowser: true, // Needed for client-side usage
});

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! How can I help you today?" } // Default bot message
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [...messages, userMessage],
      });

      const botMessage = { role: "bot", content: response.choices[0].message.content };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
    }

    setLoading(false);
    setInput("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Floating Chat Button */}
      <button
        className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600"
        onClick={toggleChat}
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 bg-white shadow-lg rounded-lg p-4 mt-2 border border-gray-300">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Healthcare Chatbot</h2>
            <button className="text-gray-600 hover:text-gray-800" onClick={toggleChat}>✖</button>
          </div>

          {/* Chat Messages */}
          <div className="h-60 overflow-y-auto border border-gray-200 rounded p-2 mt-2">
            {messages.map((msg, index) => (
              <div key={index} className={`p-2 my-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                <span className={`p-2 rounded-lg ${msg.role === "user" ? "bg-blue-200" : "bg-gray-200"}`}>
                  {msg.content}
                </span>
              </div>
            ))}
            {loading && <p className="text-gray-500">Thinking...</p>}
          </div>

          {/* Input Field */}
          <div className="flex mt-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border p-2 rounded-l-lg focus:outline-none"
              placeholder="Ask a question..."
            />
            <button
              className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600"
              onClick={handleSendMessage}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
