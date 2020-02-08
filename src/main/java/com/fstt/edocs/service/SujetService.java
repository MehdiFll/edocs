package rm.app.stock.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.stereotype.Service;

import rm.app.stock.model.Categorie;
import rm.app.stock.repository.CategorieRepository;

@Service
public class CategorieService {
	@Autowired
	CategorieRepository CategorieRep;
	
	public List<Categorie> getAllCategorie(){
		List<Categorie> list = new ArrayList<>();
		CategorieRep.findAll().forEach(list::add);
		return list;
	}
	
	
	
	public String updateCategorie(Categorie Categorie) {
		CategorieRep.save(Categorie);
		return "success";
	}
	
	public void addCategorie(Categorie Categorie) {
		CategorieRep.save(Categorie);
	}
	
	public void deleteCategorie(Categorie Categorie) {
		CategorieRep.delete(Categorie);
	}
	
	public Categorie getCategorie(Long id) {
		return CategorieRep.findById(id).orElseThrow(null);
	}
}
