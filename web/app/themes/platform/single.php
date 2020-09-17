<?php
/**
 * The Template for displaying all single posts
 *
 * Methods for TimberHelper can be found in the /lib sub-directory
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since    Timber 0.1
 */

$context = Timber::get_context();
$post = Timber::query_post();
$context['post'] = $post;
$context['comment_form'] = TimberHelper::get_comment_form();
$context['options'] = get_fields('option');

$wpseo_primary_term = new WPSEO_Primary_Term('category', $post->ID);
$wpseo_primary_term = $wpseo_primary_term->get_primary_term();

if($wpseo_primary_term) {
  $wpseo_primary_term = get_term($wpseo_primary_term);
  $first_cat = $wpseo_primary_term->term_id;
  $args = array(
    'category__in' => array($first_cat),
    'post__not_in' => array($post->ID),
    'posts_per_page' => 4
  );
  $context['related_posts'] = Timber::get_posts($args);
}


if ( post_password_required( $post->ID ) ) {
	Timber::render( 'single-password.twig', $context );
} else {
	Timber::render( array( 'single-' . $post->ID . '.twig', 'single-' . $post->post_type . '.twig', 'single.twig' ), $context );
}
