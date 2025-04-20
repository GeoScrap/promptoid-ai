"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AuthDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const getDebugInfo = async () => {
        try {
          // Get environment info
          const envInfo = {
            nodeEnv: process.env.NODE_ENV,
            origin: window.location.origin,
            pathname: window.location.pathname,
          };

          // Get NextAuth info
          const providersResponse = await fetch('/api/auth/providers');
          const providers = await providersResponse.json();

          // Get Google OAuth test info
          let googleTest = null;
          try {
            const googleResponse = await fetch('/api/auth/test-google');
            googleTest = await googleResponse.json();
          } catch (error) {
            googleTest = { error: "Failed to fetch Google test info" };
          }

          setDebugInfo({
            environment: envInfo,
            providers,
            googleTest,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          console.error("Error fetching debug info:", error);
          setDebugInfo({ error: "Failed to fetch debug info" });
        }
      };

      getDebugInfo();
    }
  }, [isVisible]);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsVisible(true)}
          className="bg-background/80 backdrop-blur-sm"
        >
          Debug Auth
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[90vw]">
      <Card className="bg-background/90 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm">Auth Debug Info</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
          <CardDescription className="text-xs">
            Environment: {process.env.NODE_ENV}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {debugInfo ? (
            <pre className="text-xs overflow-auto max-h-[50vh] p-2 bg-muted/50 rounded">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          ) : (
            <div className="text-xs text-muted-foreground">Loading debug info...</div>
          )}
          <div className="mt-2 flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setDebugInfo(null);
                setTimeout(() => {
                  const getDebugInfo = async () => {
                    try {
                      const envInfo = {
                        nodeEnv: process.env.NODE_ENV,
                        origin: window.location.origin,
                        pathname: window.location.pathname,
                      };
                      const providersResponse = await fetch('/api/auth/providers');
                      const providers = await providersResponse.json();
                      let googleTest = null;
                      try {
                        const googleResponse = await fetch('/api/auth/test-google');
                        googleTest = await googleResponse.json();
                      } catch (error) {
                        googleTest = { error: "Failed to fetch Google test info" };
                      }
                      setDebugInfo({
                        environment: envInfo,
                        providers,
                        googleTest,
                        timestamp: new Date().toISOString(),
                      });
                    } catch (error) {
                      console.error("Error fetching debug info:", error);
                      setDebugInfo({ error: "Failed to fetch debug info" });
                    }
                  };
                  getDebugInfo();
                }, 100);
              }}
              className="text-xs"
            >
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
