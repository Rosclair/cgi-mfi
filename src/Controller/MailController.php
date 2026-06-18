<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

class MailController extends AbstractController
{
    private const RECIPIENT = 'wh@cgi-mfi.com';
    private const SENDER    = 'no-reply@cgi-mfi.com';

    #[Route('/inscription', name: 'form_adhesion', methods: ['POST'])]
    public function adhesion(
        Request $request,
        MailerInterface $mailer,
        CsrfTokenManagerInterface $csrf,
    ): Response {
        $token = new CsrfToken('adhesion', $request->request->get('_token', ''));
        if (!$csrf->isTokenValid($token)) {
            $this->addFlash('error', 'Requête invalide. Veuillez réessayer.');
            return $this->redirectToRoute('home', ['_fragment' => 'join']);
        }

        $prenom    = htmlspecialchars(trim($request->request->get('prenom', '')));
        $nom       = htmlspecialchars(trim($request->request->get('nom', '')));
        $telephone = htmlspecialchars(trim($request->request->get('telephone', '')));
        $email     = htmlspecialchars(trim($request->request->get('email', '')));
        $quartier  = htmlspecialchars(trim($request->request->get('quartier', '')));
        $activite  = htmlspecialchars(trim($request->request->get('activite', '')));
        $interet   = htmlspecialchars(trim($request->request->get('interet', '')));

        if (!$prenom || !$nom || !$telephone || !$quartier || !$activite) {
            $this->addFlash('error', 'Veuillez remplir tous les champs obligatoires.');
            return $this->redirectToRoute('home', ['_fragment' => 'join']);
        }

        $html = $this->renderView('emails/adhesion.html.twig', compact(
            'prenom', 'nom', 'telephone', 'email', 'quartier', 'activite', 'interet'
        ));

        $mail = (new Email())
            ->from(self::SENDER)
            ->to(self::RECIPIENT)
            ->replyTo($email ?: self::RECIPIENT)
            ->subject("Adhésion CGI — {$prenom} {$nom}")
            ->html($html);

        $mailer->send($mail);

        $this->addFlash('success', "Merci {$prenom} ! Votre demande d'adhésion a bien été reçue. Notre équipe vous contacte sous 24h.");
        return $this->redirectToRoute('home', ['_fragment' => 'join']);
    }

    #[Route('/investisseur', name: 'form_investisseur', methods: ['POST'])]
    public function investisseur(
        Request $request,
        MailerInterface $mailer,
        CsrfTokenManagerInterface $csrf,
    ): Response {
        $token = new CsrfToken('investisseur', $request->request->get('_token', ''));
        if (!$csrf->isTokenValid($token)) {
            $this->addFlash('error', 'Requête invalide. Veuillez réessayer.');
            return $this->redirectToRoute('home', ['_fragment' => 'investors']);
        }

        $prenom           = htmlspecialchars(trim($request->request->get('prenom', '')));
        $nom              = htmlspecialchars(trim($request->request->get('nom', '')));
        $email            = htmlspecialchars(trim($request->request->get('email', '')));
        $organisation     = htmlspecialchars(trim($request->request->get('organisation', '')));
        $type_investisseur = htmlspecialchars(trim($request->request->get('type_investisseur', '')));
        $message          = htmlspecialchars(trim($request->request->get('message', '')));

        if (!$prenom || !$nom || !$email) {
            $this->addFlash('error', 'Veuillez renseigner votre nom et votre email.');
            return $this->redirectToRoute('home', ['_fragment' => 'investors']);
        }

        $html = $this->renderView('emails/investisseur.html.twig', compact(
            'prenom', 'nom', 'email', 'organisation', 'type_investisseur', 'message'
        ));

        $mail = (new Email())
            ->from(self::SENDER)
            ->to(self::RECIPIENT)
            ->replyTo($email)
            ->subject("Investisseur CGI — {$prenom} {$nom}")
            ->html($html);

        $mailer->send($mail);

        $this->addFlash('success', "Merci {$prenom} ! Votre demande a bien été transmise. Vous recevrez notre dossier sous 24h ouvrables.");
        return $this->redirectToRoute('home', ['_fragment' => 'investors']);
    }
}
