"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { RoughIdea } from "./rough-idea";

export function HeroSection() {
  console.log('HeroSection rendering');
  const { theme } = useTheme();
  // State for animation control
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPurpose, setSelectedPurpose] = useState('Request time off');
  const [selectedTone, setSelectedTone] = useState('Professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [roughIdea, setRoughIdea] = useState('Write an email to my boss');
  const [isTypingRoughIdea, setIsTypingRoughIdea] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Array of rough ideas to cycle through
  const roughIdeas = [
    'Write an email to my boss',
    'Create a marketing plan',
    'Design a landing page',
    'Write a blog post about AI',
    'Create a product description'
  ];

  // Current rough idea index
  const [currentIdeaIndex, setCurrentIdeaIndex] = useState(0);

  // The full refined prompt text
  const fullRefinedPrompt = "Write a professional email to my manager requesting time off for 3 days. Include relevant details like dates, reason for absence, and how my work will be covered during my absence. End with an appropriate professional closing.";

  // We'll keep this function for future use but it's not being used currently
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const typeText = async (text: string, setter: (text: string) => void, speed = 50) => {
    setter(''); // Clear previous text
    let currentText = '';

    for (let i = 0; i < text.length; i++) {
      currentText += text[i];
      setter(currentText);
      console.log('Typing character:', text[i], 'Current text:', currentText);
      // Random delay to simulate realistic typing
      await new Promise(resolve => setTimeout(resolve,
        speed + (Math.random() * 30)
      ));
    }

    return true; // Typing complete
  };

  // Function to generate text in a ChatGPT-like fashion
  const generateTextInChunks = async (text: string, setter: (text: string) => void) => {
    setter(''); // Clear previous text
    let currentText = '';

    // Add a slight pause before starting to generate
    await new Promise(resolve => setTimeout(resolve, 800));

    // Split text into words for word-by-word generation
    const words = text.split(' ');

    // Track the current position in generation
    let position = 0;

    // Process words with variable speeds and pauses to mimic ChatGPT
    while (position < words.length) {
      // Determine how many words to generate in this burst (1-4 words)
      // More variation in burst size creates a more natural typing rhythm
      const burstSize = Math.min(
        1 + Math.floor(Math.random() * 3),
        words.length - position
      );

      // Generate the burst of words
      for (let i = 0; i < burstSize; i++) {
        // Add the word with proper spacing
        currentText += (currentText ? ' ' : '') + words[position];
        setter(currentText);
        position++;

        // Short delay between words in the same burst
        if (i < burstSize - 1) {
          const wordLength = words[position - 1].length;
          // Shorter delays for words in the same burst to create a natural rhythm
          // Longer words get slightly longer delays
          await new Promise(resolve => setTimeout(resolve,
            15 + Math.min(wordLength * 4, 35) + (Math.random() * 25)
          ));
        }
      }

      // Determine if we should pause to simulate "thinking"
      const shouldPause = Math.random() < 0.25 || position % 10 === 0;

      if (shouldPause && position < words.length) {
        // Longer pause to simulate thinking
        await new Promise(resolve => setTimeout(resolve,
          250 + Math.random() * 350
        ));
      } else {
        // Normal pause between bursts
        await new Promise(resolve => setTimeout(resolve,
          60 + Math.random() * 100
        ));
      }
    }

    return true; // Generation complete
  };

  // Animation sequence
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after unmount

    // Start the sequence
    const runAnimationSequence = async () => {
      // Reset all states
      if (!isMounted) return;

      // Set a static rough idea immediately
      setRoughIdea('Write an email to my boss');
      console.log('Set initial rough idea');

      setCurrentStep(0);
      setGeneratedText('');
      setShowCursor(true);
      setIsGenerating(false);
      setAnimationComplete(false);

      // Wait for initial render
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (!isMounted) return;

      // Skip the typing animation for now
      setIsTypingRoughIdea(false);

      // Pause after typing rough idea
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (!isMounted) return;

      // Step 2: Show purpose options
      setCurrentStep(1);
      playSubtleSound();

      // Wait and then select purpose
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (!isMounted) return;
      setCurrentStep(2);
      playSelectionSound();

      // Wait and then show tone options
      await new Promise(resolve => setTimeout(resolve, 1200));
      if (!isMounted) return;
      setCurrentStep(3);
      playSubtleSound();

      // Wait and then select tone
      await new Promise(resolve => setTimeout(resolve, 1800));
      if (!isMounted) return;
      setCurrentStep(4);
      playSelectionSound();

      // Wait and then start generating the refined prompt
      await new Promise(resolve => setTimeout(resolve, 1200));
      if (!isMounted) return;
      setCurrentStep(5);
      setIsGenerating(true);

      // Generate the refined prompt in a ChatGPT-like fashion
      console.log('Starting to generate text in ChatGPT style');
      await generateTextInChunks(fullRefinedPrompt, setGeneratedText);
      console.log('Finished generating text');
      if (!isMounted) return;

      // Completion effect
      setIsGenerating(false);
      setShowCursor(false);
      setAnimationComplete(true);

      // Display the result for 3 seconds
      await new Promise(resolve => setTimeout(resolve, 3000));
      if (!isMounted) return;

      // Move to the next idea for the next cycle
      setCurrentIdeaIndex((prevIndex) => (prevIndex + 1) % roughIdeas.length);

      // Start the sequence again
      runAnimationSequence();
    };

    // Start the animation sequence
    runAnimationSequence();

    // Cleanup function
    return () => {
      isMounted = false; // Prevent state updates after component unmount
    };
  }, [currentIdeaIndex]);

  // Function to simulate subtle UI sound (doesn't actually play sound, just for the concept)
  const playSubtleSound = () => {
    // In a real implementation, you would play a subtle UI sound here
    // For example: new Audio('/sounds/subtle-pop.mp3').play();
    console.log('Playing subtle sound');
  };

  // Function to simulate selection sound
  const playSelectionSound = () => {
    // In a real implementation, you would play a selection sound here
    // For example: new Audio('/sounds/select.mp3').play();
    console.log('Playing selection sound');
  };

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-10 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4 max-w-3xl"
          >
            <h1 className={`text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent pb-2 drop-shadow-md ${theme === 'dark' ? 'bg-gradient-to-r from-primary via-white to-chart-2' : 'bg-gradient-to-r from-primary via-primary/80 to-chart-2'}`}>
              Promptoid AI
            </h1>
            <p className="text-lg md:text-xl text-foreground/90 max-w-[700px] mx-auto font-medium">
              Where Ideas Evolve Into Clarity
            </p>
            <p className="text-base md:text-lg text-foreground/80 max-w-[700px] mx-auto">
              Transform your rough ideas into precise, detailed prompts that unlock the full potential of AI tools like ChatGPT.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/signup">
              <Button size="lg" className="group bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all duration-300">
                <Sparkles className="mr-2 h-4 w-4 text-primary" />
                Learn More
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative w-full max-w-5xl mx-auto mt-8 rounded-xl overflow-hidden border border-primary/30 shadow-2xl backdrop-blur-lg"
          >
            {/* Add animated gradient border effect */}
            <motion.div
              className="absolute inset-0 rounded-xl opacity-50"
              style={{
                background: 'linear-gradient(90deg, rgba(var(--primary), 0.3), rgba(var(--chart-2), 0.3), rgba(var(--primary), 0.3))',
                backgroundSize: '200% 100%',
              }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-chart-2/10" />
            {/* Add subtle glow effect */}
            <div className="absolute -inset-0.5 bg-primary/5 rounded-xl blur-xl opacity-50" />
            <div className={`relative p-6 sm:p-10 backdrop-blur-md ${theme === 'dark' ? 'bg-card/60' : 'bg-card/90'}`}>
              <div className="space-y-6">
                <RoughIdea />

                <AnimatePresence>
                  <div className="space-y-4">
                    <div className="text-sm font-medium text-muted-foreground text-center">Promptoid AI refinement questions</div>
                    <div className="grid gap-4">
                      {/* Purpose question */}
                      <motion.div
                        className={`p-4 rounded-lg shadow-md ${theme === 'dark' ? 'bg-background/80 border border-border/80' : 'bg-background/95 border border-border'}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: currentStep >= 1 ? 1 : 0, y: currentStep >= 1 ? 0 : 20 }}
                        transition={{ duration: 0.5 }}
                      >
                        <p className="text-center mb-3 font-medium">What is the purpose of this email?</p>
                        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                          <motion.div
                            className={`p-3 rounded-md ${currentStep >= 2 ? 'bg-primary/15 border-primary/30 shadow-sm' : 'bg-background/40 border-border/40'} border text-center hover:bg-primary/20 transition-all duration-300 cursor-pointer`}
                            whileHover={{ scale: 1.03, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            animate={{
                              scale: currentStep === 2 ? [1, 1.05, 1] : 1,
                              backgroundColor: currentStep >= 2 ? 'rgba(var(--primary), 0.15)' : 'rgba(var(--background), 0.4)',
                              borderColor: currentStep >= 2 ? 'rgba(var(--primary), 0.3)' : 'rgba(var(--border), 0.4)',
                              boxShadow: currentStep >= 2 ? '0 4px 12px rgba(0,0,0,0.1)' : '0 0 0 rgba(0,0,0,0)'
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <span className="font-medium">Request time off</span>
                          </motion.div>
                          <motion.div
                            className="p-3 rounded-md bg-background/40 border border-border/40 text-center hover:bg-background/50 transition-all duration-200 cursor-pointer"
                            whileHover={{ scale: 1.03, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                          >
                            <span>Project update</span>
                          </motion.div>
                        </div>
                      </motion.div>

                      {/* Tone question */}
                      <motion.div
                        className={`p-4 rounded-lg shadow-md ${theme === 'dark' ? 'bg-background/80 border border-border/80' : 'bg-background/95 border border-border'}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: currentStep >= 3 ? 1 : 0, y: currentStep >= 3 ? 0 : 20 }}
                        transition={{ duration: 0.5 }}
                      >
                        <p className="text-center mb-3 font-medium">What tone would you like to use?</p>
                        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                          <motion.div
                            className={`p-3 rounded-md ${currentStep >= 4 ? 'bg-primary/15 border-primary/30 shadow-sm' : 'bg-background/40 border-border/40'} border text-center hover:bg-primary/20 transition-all duration-300 cursor-pointer`}
                            whileHover={{ scale: 1.03, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            animate={{
                              scale: currentStep === 4 ? [1, 1.05, 1] : 1,
                              backgroundColor: currentStep >= 4 ? 'rgba(var(--primary), 0.15)' : 'rgba(var(--background), 0.4)',
                              borderColor: currentStep >= 4 ? 'rgba(var(--primary), 0.3)' : 'rgba(var(--border), 0.4)',
                              boxShadow: currentStep >= 4 ? '0 4px 12px rgba(0,0,0,0.1)' : '0 0 0 rgba(0,0,0,0)'
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <span className="font-medium">Professional</span>
                          </motion.div>
                          <motion.div
                            className="p-3 rounded-md bg-background/40 border border-border/40 text-center hover:bg-background/50 transition-all duration-200 cursor-pointer"
                            whileHover={{ scale: 1.03, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                          >
                            <span>Casual</span>
                          </motion.div>
                          <motion.div
                            className="p-3 rounded-md bg-background/40 border border-border/40 text-center hover:bg-background/50 transition-all duration-200 cursor-pointer"
                            whileHover={{ scale: 1.03, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                          >
                            <span>Formal</span>
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </AnimatePresence>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: currentStep >= 5 ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-sm font-medium text-muted-foreground text-center">Refined prompt</div>
                  <div className={`p-4 rounded-lg shadow-lg min-h-[120px] flex items-center justify-center ${theme === 'dark' ? 'bg-primary/20 border border-primary/40' : 'bg-primary/15 border border-primary/30'}`}>
                    <div className="w-full max-w-2xl mx-auto">
                      <p className="text-center relative font-medium">
                        <span className={`${theme === 'dark' ? 'text-foreground' : 'text-foreground font-semibold'}`}>
                          {generatedText}
                        </span>
                        {isGenerating && showCursor && (
                          <motion.span
                            className={`inline-block w-2 h-5 ml-1 ${theme === 'dark' ? 'bg-primary' : 'bg-primary'}`}
                            animate={{
                              opacity: [1, 0.4, 1],
                              height: ['20px', '18px', '20px'],
                              width: ['2px', '2px', '2px']
                            }}
                            transition={{
                              duration: 0.7,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          ></motion.span>
                        )}

                        {/* Show a static cursor when generation is complete */}
                        {!isGenerating && !showCursor && generatedText && (
                          <span className={`inline-block w-2 h-5 ml-1 ${theme === 'dark' ? 'bg-primary/50' : 'bg-primary/60'}`}></span>
                        )}
                      </p>

                      {/* Add a subtle glow effect when generating */}
                      {isGenerating && (
                        <motion.div
                          className={`absolute inset-0 rounded-lg ${theme === 'dark' ? 'opacity-30' : 'opacity-20'}`}
                          animate={{
                            boxShadow: theme === 'dark'
                              ? ['0 0 10px rgba(var(--primary), 0.3)', '0 0 20px rgba(var(--primary), 0.5)', '0 0 10px rgba(var(--primary), 0.3)']
                              : ['0 0 10px rgba(var(--primary), 0.2)', '0 0 15px rgba(var(--primary), 0.3)', '0 0 10px rgba(var(--primary), 0.2)']
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}