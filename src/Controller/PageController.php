<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class PageController extends AbstractController
{
    #[Route('/', name: 'home')]
    public function home(): Response
    {
        return $this->render('pages/home.html.twig');
    }

    #[Route('/faq', name: 'faq')]
    public function faq(): Response
    {
        return $this->render('pages/faq.html.twig');
    }

    #[Route('/agenda', name: 'agenda')]
    public function agenda(): Response
    {
        return $this->render('pages/agenda.html.twig');
    }

    #[Route('/simulateur-credit', name: 'simulateur_credit')]
    public function simulateurCredit(): Response
    {
        return $this->render('pages/simulateur-credit.html.twig');
    }

    #[Route('/cgi-foundation', name: 'cgi_foundation')]
    public function cgiFoundation(): Response
    {
        return $this->render('pages/cgi-foundation.html.twig');
    }

    #[Route('/cgi-cgu', name: 'cgi_cgu')]
    public function cgiCgu(): Response
    {
        return $this->render('pages/cgi-cgu.html.twig');
    }

    #[Route('/cgi-confidentialite', name: 'cgi_confidentialite')]
    public function cgiConfidentialite(): Response
    {
        return $this->render('pages/cgi-confidentialite.html.twig');
    }

    #[Route('/sitemap', name: 'sitemap')]
    public function sitemap(): Response
    {
        return $this->render('pages/sitemap.html.twig');
    }
}
