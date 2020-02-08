package com.fstt.edocs.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.fstt.edocs.model.Sujet;

@Repository
public interface SujetRepository extends CrudRepository<Sujet,Long> {

}
