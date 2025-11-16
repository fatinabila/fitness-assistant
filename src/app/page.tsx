"use client";
import { Dumbbell } from "lucide-react";
import { Header } from "./components/Header";
import { WorkoutSession } from "./components/WorkoutSession";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";

export default function Home() {
  return (
    <div className="p-4">
      <Header />

      <Tabs defaultValue="session" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="session" className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4" />
            Current Session
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="session">
          <WorkoutSession />
        </TabsContent>
      </Tabs>
    </div>
  );
}
