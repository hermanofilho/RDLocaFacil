import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Motorcycle, MotorcycleStatus } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MotorcycleFormProps {
  motorcycle?: Motorcycle | null;
  onClose: (refreshData?: boolean) => void;
}

export const MotorcycleForm: React.FC<MotorcycleFormProps> = ({ motorcycle, onClose }) => {
  const isEditing = !!motorcycle;
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    brand: motorcycle?.brand || '',
    model: motorcycle?.model || '',
    licensePlate: motorcycle?.licensePlate || '',
    year: motorcycle?.year || '',
    mileage: motorcycle?.mileage?.toString() || '0',
    status: motorcycle?.status || 'available' as MotorcycleStatus,
    weeklyRate: motorcycle?.weeklyRate?.toString() || '',
    observations: motorcycle?.observations || '',
    photo: motorcycle?.photo || ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleStatusChange = (value: string) => {
    // Make sure the value is cast to MotorcycleStatus
    setFormData(prev => ({ ...prev, status: value as MotorcycleStatus }));
    if (errors.status) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.status;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.brand.trim()) {
      newErrors.brand = 'Marca é obrigatória';
    }
    
    if (!formData.model.trim()) {
      newErrors.model = 'Modelo é obrigatório';
    }
    
    if (!formData.licensePlate.trim()) {
      newErrors.licensePlate = 'Placa é obrigatória';
    }
    
    if (!formData.year.trim()) {
      newErrors.year = 'Ano é obrigatório';
    }
    
    if (!formData.mileage.trim() || isNaN(Number(formData.mileage))) {
      newErrors.mileage = 'Quilometragem válida é obrigatória';
    }
    
    if (!formData.weeklyRate.trim() || isNaN(Number(formData.weeklyRate)) || Number(formData.weeklyRate) <= 0) {
      newErrors.weeklyRate = 'Valor semanal válido é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Map form data to database column names
      const dbData = {
        brand: formData.brand,
        model: formData.model,
        licenseplate: formData.licensePlate,
        year: formData.year,
        mileage: Number(formData.mileage),
        status: formData.status,
        weeklyrate: Number(formData.weeklyRate),
        observations: formData.observations,
        photo: formData.photo,
        updatedat: new Date().toISOString()
      };

      if (isEditing && motorcycle) {
        // Update existing motorcycle
        const { error } = await supabase
          .from('motorcycles')
          .update(dbData)
          .eq('id', motorcycle.id);
          
        if (error) throw error;
        
        toast({
          title: "Moto atualizada",
          description: "As informações foram atualizadas com sucesso",
        });
      } else {
        // Insert new motorcycle
        const { error } = await supabase
          .from('motorcycles')
          .insert({
            ...dbData,
            createdat: new Date().toISOString()
          });
          
        if (error) throw error;
        
        toast({
          title: "Moto cadastrada",
          description: "Moto cadastrada com sucesso",
        });
      }
      
      onClose(true);
    } catch (error) {
      console.error('Error saving motorcycle:', error);
      toast({
        title: "Erro",
        description: `Não foi possível ${isEditing ? 'atualizar' : 'cadastrar'} a moto`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Moto' : 'Nova Moto'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Edite os dados da moto no formulário abaixo.' 
              : 'Preencha os dados da moto para cadastro.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Marca <span className="text-red-500">*</span></Label>
              <Input
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className={errors.brand ? 'border-red-500' : ''}
              />
              {errors.brand && <p className="text-red-500 text-sm">{errors.brand}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Modelo <span className="text-red-500">*</span></Label>
              <Input
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className={errors.model ? 'border-red-500' : ''}
              />
              {errors.model && <p className="text-red-500 text-sm">{errors.model}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="licensePlate">Placa <span className="text-red-500">*</span></Label>
              <Input
                id="licensePlate"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleChange}
                className={errors.licensePlate ? 'border-red-500' : ''}
              />
              {errors.licensePlate && <p className="text-red-500 text-sm">{errors.licensePlate}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year">Ano <span className="text-red-500">*</span></Label>
              <Input
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className={errors.year ? 'border-red-500' : ''}
              />
              {errors.year && <p className="text-red-500 text-sm">{errors.year}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mileage">Quilometragem <span className="text-red-500">*</span></Label>
              <Input
                id="mileage"
                name="mileage"
                type="number"
                value={formData.mileage}
                onChange={handleChange}
                className={errors.mileage ? 'border-red-500' : ''}
              />
              {errors.mileage && <p className="text-red-500 text-sm">{errors.mileage}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
              <Select defaultValue={formData.status} onValueChange={handleStatusChange}>
                <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Disponível</SelectItem>
                  <SelectItem value="rented">Alugada</SelectItem>
                  <SelectItem value="maintenance">Em manutenção</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weeklyRate">Valor Semanal (R$) <span className="text-red-500">*</span></Label>
              <Input
                id="weeklyRate"
                name="weeklyRate"
                type="number"
                step="0.01"
                value={formData.weeklyRate}
                onChange={handleChange}
                className={errors.weeklyRate ? 'border-red-500' : ''}
              />
              {errors.weeklyRate && <p className="text-red-500 text-sm">{errors.weeklyRate}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="observations">Observações</Label>
            <Textarea
              id="observations"
              name="observations"
              value={formData.observations}
              onChange={handleChange}
              placeholder="Informações adicionais sobre a moto"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="photo">URL da Foto</Label>
            <Input
              id="photo"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
              placeholder="http://exemplo.com/foto.jpg"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onClose()} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
