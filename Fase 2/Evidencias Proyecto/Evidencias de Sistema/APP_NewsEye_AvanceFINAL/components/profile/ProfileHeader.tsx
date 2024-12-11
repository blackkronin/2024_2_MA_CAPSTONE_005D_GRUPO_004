"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { User } from "@supabase/supabase-js";
import "@/app/Profile.css";
import "@/app/apaStyle.css"
import ReactMarkdown from 'react-markdown';

const JSON_CDN_URL = "https://utqsosamxdrwvujmdxkw.supabase.co/storage/v1/object/public/reportes.usuarios/";

interface JsonData {
  title: string;
  summary: string;
  category: string;
  date: string;
  structure: string[];
  content: string;
  author: string;
}

interface FileData {
  name: string;
  path: string;
}

const extractSectionContent = (content: string, section: string, nextSection: string | null) => {
  const start = content.indexOf(`### ${section}`);
  if (start === -1) return ''; // Si no se encuentra la sección, devolver una cadena vacía
  const end = nextSection ? content.indexOf(`### ${nextSection}`, start) : content.length;
  return content.substring(start + `### ${section}`.length, end).trim();
};

const PostItem = ({ file, jsonData, onSelect, user, selectedFolder }: { file: FileData; jsonData: JsonData | null; onSelect: () => void; user: User; selectedFolder: string }) => {
  const [showFullReport, setShowFullReport] = useState(false);
  const [alert, setAlert] = useState<{ type: string, message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleDeleteReport = async () => {
    setLoading(true);
    setError(null);
  
    const filePath = `reports_user_${user.id}/${selectedFolder}/${file.name}`;
    console.log("Attempting to delete file at path:", filePath);
  
    try {
      const { error } = await supabase.storage
        .from("reportes.usuarios")
        .remove([filePath]);
  
      if (error) {
        console.error("Error deleting report:", error.message);
        throw error;
      }
  
      console.log("File deleted successfully.");
      setAlert({ type: 'success', message: 'Reporte eliminado exitosamente' });
  
      // Refresh the list of reports
      await onSelect(); // Ensure this function fetches the latest data
  
    } catch (err) {
      console.error("Error deleting report:", err);
      setAlert({ type: 'error', message: 'Error al eliminar el reporte: ' + (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

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
              <div className="apa-text mt-4 p-4 bg-white rounded-md">
                <h1 className="title h1">{jsonData.title}</h1>
                <ReactMarkdown className="long">
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
            
            {alert && (
              <Alert variant={alert.type === 'success' ? 'default' : 'destructive'}>
                <AlertTitle>{alert.type === 'success' ? 'Éxito' : 'Error'}</AlertTitle>
                <AlertDescription>{alert.message}</AlertDescription>
              </Alert>
            )}
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

  return (
    <div className="perfil-personal__container">
      <Card className="perfil-personal__card mb-6">
        <CardHeader className="flex justify-center">
          <Avatar className="perfil-personal__avatar">
            <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Avatar" />
            <AvatarFallback>
              {user?.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent>
          <h2 className="perfil-personal__name">
            {user?.user_metadata.full_name}
          </h2>
          <p className="perfil-personal__category">{user?.user_metadata.first_cat}</p>
          <div className="perfil-personal__interests">
            <h3 className="font-semibold text-gray-700">Intereses:</h3>
            <ul className="list-none space-y-1">
              {user?.user_metadata.interests.split(',').map((interest: string, index: number) => (
                <li key={index} className="perfil-personal__interest-item">
                  {interest.trim()}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Perfil Personal</h1>
      </div>

      <Tabs value={selectedFolder} onValueChange={(value) => {
        setSelectedFolder(value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '_'));
      }} className="w-full">
        <TabsList className="tabs-list">
          <TabsTrigger value="conocimiento" className="tabs-trigger">Conocimiento</TabsTrigger>
          <TabsTrigger value="profesion" className="tabs-trigger">Profesión</TabsTrigger>
          <TabsTrigger value="para_mi" className="tabs-trigger">Para Mí</TabsTrigger>
        </TabsList>
        {["conocimiento", "profesion", "para_mi"].map((folder) => (
          <TabsContent key={folder} value={folder}>
            {loading && <p>Cargando archivos...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {user && files.map((file) => (
              <PostItem
                key={file.path}
                file={file}
                jsonData={jsonDataMap.get(file.path) || null}
                onSelect={() => listFiles(selectedFolder)}
                user={user}
                selectedFolder={selectedFolder}
              />
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

