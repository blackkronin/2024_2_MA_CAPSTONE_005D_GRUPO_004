"use client";

import React, { useState, useEffect } from 'react';
import { traerNoticias, Article } from '@/utils/newsapi/traer_noticas';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Modal from './modalAPI';

const TraerNoticias = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
/* parametros de pop up */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });

  const openModal = (title:any, content:any) => {
    setModalContent({ title, content });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const data = await traerNoticias('c9eda70565b646d38e6ecdf2890392e3', 'us', page);
        setArticles(data.articles);
      } catch (error) {
        setIsError(true);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [page]);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  if (isLoading) return <div className="center">Loading...</div>;
  if (isError) return <div className="center">Something went wrong, Please try again.</div>;

  return (
    <div className="container">
      <h1 className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">Noticias Populares - News Api</h1>
      <div className="pagination-controls mb-4 flex justify-between">
        <Button onClick={handlePreviousPage} disabled={page === 1}>← Previous</Button>
        <Button onClick={handleNextPage}>Next →</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {articles.map((article, index) => (
          article.description && (
            <Card key={`${article.url}-${index}`}>
              {article.urlToImage && (
                <img src={article.urlToImage} alt={article.title} className="rounded-t-lg" />
              )}
              <CardHeader>
                <CardTitle>{article.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{article.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button onClick={() => openModal(article.title, article.description)}>
                  Ver más
                </Button>
              </CardFooter>
            </Card>
          )
        ))}
      </div>
      <div className="pagination-controls mt-4 flex justify-between">
        <Button onClick={handlePreviousPage} disabled={page === 1}>← Previous</Button>
        <Button onClick={handleNextPage}>Next →</Button>
      </div>
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={modalContent.title} 
        content={modalContent.content} 
      />
    </div>
  );
};

export default TraerNoticias;