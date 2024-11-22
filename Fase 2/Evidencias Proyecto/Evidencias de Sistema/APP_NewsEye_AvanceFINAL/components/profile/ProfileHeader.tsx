"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User } from "@supabase/supabase-js";
import "@/app/Profile.css";

const JSON_CDN_URL = "https://utqsosamxdrwvujmdxkw.supabase.co/storage/v1/object/public/reportes.usuarios/";

interface JsonData {
  title: string;
  summary: string;
  category: string;
  date: string;
  structure: string[];
  content: string;
}

interface FileData {
  name: string;
  path: string;
}

const PostItem = ({ file, jsonData, onSelect }: { file: FileData; jsonData: JsonData | null; onSelect: () => void }) => {
  const [showFullReport, setShowFullReport] = useState(false);

  if (!jsonData) return null;

  return (
    <Card className="perfil-personal__card mb-4 hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-gray-50">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold text-primary">{jsonData.title}</CardTitle>
            <CardDescription className="mt-1 text-sm text-gray-500">{jsonData.date}</CardDescription>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
            {jsonData.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {showFullReport ? (
          <>
            <Button 
              variant="outline" 
              className="mb-4" 
              onClick={() => setShowFullReport(false)}
            >
              Volver
            </Button>
            <ScrollArea className="h-[60vh] pr-4">
              <ReactMarkdown 
                className="prose prose-blue max-w-none dark:prose-invert"
                remarkPlugins={[remarkGfm]}
              >
                {jsonData.content}
              </ReactMarkdown>
            </ScrollArea>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground line-clamp-3">{jsonData.summary}</p>
            <Button 
              variant="outline" 
              className="mt-2 w-full hover:bg-blue-50"
              onClick={() => setShowFullReport(true)}
            >
              Ver Informe Completo
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default function PerfilPersonal() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [jsonDataMap, setJsonDataMap] = useState<Map<string, JsonData>>(new Map());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string>("conocimiento");
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    first_cat: '',
    second_cat: '',
    interests: [] as string[]
  });

  const listFiles = async (folder: string) => {
    try {
      setLoading(true);
      setError(null);
      setFiles([]);

      const folderPath = `reports_user_${user?.id}/${folder}`;
      const { data, error } = await supabase.storage.from("reportes.usuarios").list(folderPath, {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "desc" },
      });

      if (error) throw new Error(`Error al listar archivos: ${error.message}`);

      const mappedFiles = data
        ?.filter(file => file.name.endsWith('.json'))
        .map((file) => ({
          name: file.name,
          path: `${folderPath}/${file.name}`,
        })) || [];

      setFiles(mappedFiles);

      // Fetch JSON data for all files
      const jsonPromises = mappedFiles.map(file => fetchJsonData(file.path));
      await Promise.all(jsonPromises);

    } catch (err) {
      console.error("Error al listar archivos:", err);
      setError("No se pudieron cargar los archivos.");
    } finally {
      setLoading(false);
    }
  };

  const fetchJsonData = async (filePath: string) => {
    try {
      const response = await fetch(JSON_CDN_URL + filePath);
      if (!response.ok) throw new Error(`Error al obtener el archivo JSON: ${response.statusText}`);
      const data: JsonData = await response.json();
      setJsonDataMap(prev => new Map(prev).set(filePath, data));
    } catch (err) {
      console.error("Error al obtener los datos JSON:", err);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      console.log(user);
    };

    fetchUser();
    listFiles(selectedFolder);
  }, [selectedFolder]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        return;
      }

      if (user) {
        const { full_name, first_cat, second_cat, interests } = user.user_metadata;
        setProfile({
          full_name: full_name || 'Usuario desconocido',
          email: user.email || 'Email no disponible',
          first_cat: first_cat || 'Categoría no especificada',
          second_cat: second_cat || 'Ocupación no especificada',
          interests: typeof interests === 'string' ? 
            interests.split(',').map(item => item.trim()) : 
            Array.isArray(interests) ? interests : []
        });
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="perfil-personal__container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex justify-center">
              <Avatar className="w-32 h-32 bg-blue-100 text-blue-600">
                <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Avatar" />
                <AvatarFallback>
                  {profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-bold text-center mb-2 text-blue-600">
              {profile.full_name}
            </h2>
            <p className="text-center text-muted-foreground mb-4">{profile.first_cat}</p>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">Intereses:</h3>
              <ul className="list-none space-y-1">
                {profile.interests.map((interest, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {interest}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Tabs value={selectedFolder} onValueChange={setSelectedFolder} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="conocimiento">Conocimiento</TabsTrigger>
              <TabsTrigger value="profesion">Profesión</TabsTrigger>
              <TabsTrigger value="para_mi">Para Mí</TabsTrigger>
            </TabsList>
            {["conocimiento", "profesion", "para_mi"].map((folder) => (
              <TabsContent key={folder} value={folder}>
                {loading && <p>Cargando archivos...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {files.map((file) => (
                  <PostItem
                    key={file.path}
                    file={file}
                    jsonData={jsonDataMap.get(file.path) || null}
                    onSelect={() => {}}
                  />
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}