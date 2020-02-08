package com.fstt.edocs.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.fstt.edocs.model.Commentaire;


@Repository
public interface CommentaireRepository extends CrudRepository<Commentaire,Long> {

}
