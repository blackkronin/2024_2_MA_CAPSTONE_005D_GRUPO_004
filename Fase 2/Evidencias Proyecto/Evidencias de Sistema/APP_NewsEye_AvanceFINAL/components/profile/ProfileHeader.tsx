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
          <CardHeader className="card-header">
              <div className="flex justify-between items-start">
                  <div>
                      <CardTitle className="card-title">{jsonData.title}</CardTitle>
                      <CardDescription className="card-description">{jsonData.date}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                      {jsonData.category}
                  </Badge>
              </div>
          </CardHeader>
          <CardContent className="card-content">
              {showFullReport ? (
                  <>
                      <Button 
                          variant="outline" 
                          className="button-outline" 
                          onClick={() => setShowFullReport(false)}
                      >
                          Volver
                      </Button>
                      <ScrollArea className="scroll-area">
                          <div className="apa-text">
                              <ReactMarkdown 
                                  className="max-w-none"
                                  remarkPlugins={[remarkGfm]}
                              >
                                  {jsonData.content}
                              </ReactMarkdown>
                          </div>
                      </ScrollArea>
                  </>
              ) : (
                  <>
                      <p className="text-sm text-muted-foreground line-clamp-3">{jsonData.summary}</p>
                      <Button 
                          variant="outline" 
                          className="button-outline"
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
    <div className="perfil-personal__container">
      <Card className="perfil-personal__card mb-6">
        <CardHeader className="flex justify-center">
          <Avatar className="perfil-personal__avatar">
            <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Avatar" />
            <AvatarFallback>
              {profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent>
          <h2 className="perfil-personal__name">
            {profile.full_name}
          </h2>
          <p className="perfil-personal__category">{profile.first_cat}</p>
          <div className="perfil-personal__interests">
            <h3 className="font-semibold text-gray-700">Intereses:</h3>
            <ul className="list-none space-y-1">
              {profile.interests.map((interest, index) => (
                <li key={index} className="perfil-personal__interest-item">
                  {interest}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedFolder} onValueChange={setSelectedFolder} className="w-full">
        <TabsList className="tabs-list">
          <TabsTrigger value="conocimiento" className="tabs-trigger">Conocimiento</TabsTrigger>
          <TabsTrigger value="profesion" className="tabs-trigger">Profesión</TabsTrigger>
          <TabsTrigger value="para_mi" className="tabs-trigger">Para Mí</TabsTrigger>
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
  );
}