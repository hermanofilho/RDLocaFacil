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
import { Client } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ClientFormProps {
  client?: Client | null;
  onClose: (refreshData?: boolean) => void;
}

export const ClientForm: React.FC<ClientFormProps> = ({ client, onClose }) => {
  const isEditing = !!client;
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: client?.fullName || '',
    cpf: client?.cpf || '',
    phone: client?.phone || '',
    address: client?.address || '',
    birthDate: client?.birthDate ? client.birthDate.substring(0, 10) : '',
    licenseNumber: client?.licenseNumber || '',
    licenseCategory: client?.licenseCategory || '',
    licenseValidity: client?.licenseValidity ? client.licenseValidity.substring(0, 10) : '',
    observations: client?.observations || '',
  });

  
  const [licenseFrontFile, setLicenseFrontFile] = useState<File | null>(null);
  const [licenseBackFile, setLicenseBackFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [termsFile, setTermsFile] = useState<File | null>(null);


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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nome é obrigatório';
    }
    
    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!/^\d{11}$/.test(formData.cpf.trim())) {
      newErrors.cpf = 'CPF deve conter 11 dígitos';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!/^\d{10,11}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Telefone inválido';
    }
    
    if (!formData.birthDate) {
      newErrors.birthDate = 'Data de nascimento é obrigatória';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Endereço é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  

  const handleFileUpload = async (file: File, path: string) => {
    const { data, error } = await supabase.storage.from('documents').upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

    if (error) {
      console.error('Erro ao enviar arquivo:', error.message);
      toast({ title: 'Erro', description: `Falha ao enviar ${path}`, variant: 'destructive' });
      return '';
    }

    const { data: urlData } = supabase.storage.from('documents').getPublicUrl(path);
    return urlData?.publicUrl || '';
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);


      const licenseFrontUrl = licenseFrontFile ? await handleFileUpload(licenseFrontFile, `cnh/front-${Date.now()}`) : client?.licenseImageFront || '';
      const licenseBackUrl = licenseBackFile ? await handleFileUpload(licenseBackFile, `cnh/back-${Date.now()}`) : client?.licenseImageBack || '';
      const photoUrl = photoFile ? await handleFileUpload(photoFile, `clientes/photo-${Date.now()}`) : client?.photo || '';
      const proofUrl = proofFile ? await handleFileUpload(proofFile, `clientes/proof-${Date.now()}`) : client?.proofOfAddress || '';
      const termsUrl = termsFile ? await handleFileUpload(termsFile, `clientes/terms-${Date.now()}`) : client?.signedTerms || '';

    
    try {
      // Correção: usando nomes de colunas em minúsculas para corresponder ao banco de dados
      const dbData = {
        fullname: formData.fullName,
        cpf: formData.cpf,
        phone: formData.phone,
        address: formData.address,
        licenseimagefront: licenseFrontUrl,
        licenseimageback: licenseBackUrl,
        photo: photoUrl,
        proofofaddress: proofUrl,
        signedterms: termsUrl,
        birthdate: formData.birthDate, // birthdate, não birthDate
        licensenumber: formData.licenseNumber,
        licensecategory: formData.licenseCategory,
        licensevalidity: formData.licenseValidity,
        observations: formData.observations,
        updatedat: new Date().toISOString()
      };

      if (isEditing && client) {
        // Update existing client
        const { error } = await supabase
          .from('clients')
          .update(dbData)
          .eq('id', client.id);
          
        if (error) throw error;
        
        toast({
          title: "Cliente atualizado",
          description: "As informações foram atualizadas com sucesso",
        });
      } else {
        // Insert new client
        const { error } = await supabase
          .from('clients')
          .insert({
            ...dbData,
            createdat: new Date().toISOString()
          });
          
        if (error) {
          console.error("Error saving client:", error);
          throw error;
        }
        
        toast({
          title: "Cliente cadastrado",
          description: "Cliente cadastrado com sucesso",
        });
      }
      
      onClose(true);
    } catch (error) {
      console.error('Error saving client:', error);
      toast({
        title: "Erro",
        description: `Não foi possível ${isEditing ? 'atualizar' : 'cadastrar'} o cliente`,
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
          <DialogTitle>{isEditing ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Edite os dados do cliente no formulário abaixo.' 
              : 'Preencha os dados do cliente para cadastro.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo <span className="text-red-500">*</span></Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={errors.fullName ? 'border-red-500' : ''}
              />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF <span className="text-red-500">*</span></Label>
              <Input
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="Somente números"
                maxLength={11}
                className={errors.cpf ? 'border-red-500' : ''}
              />
              {errors.cpf && <p className="text-red-500 text-sm">{errors.cpf}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone <span className="text-red-500">*</span></Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Somente números"
                maxLength={11}
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="birthDate">Data de Nascimento <span className="text-red-500">*</span></Label>
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                className={errors.birthDate ? 'border-red-500' : ''}
              />
              {errors.birthDate && <p className="text-red-500 text-sm">{errors.birthDate}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Endereço <span className="text-red-500">*</span></Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? 'border-red-500' : ''}
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="licenseNumber">Número da CNH</Label>
              <Input
                id="licenseNumber"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="licenseCategory">Categoria da CNH</Label>
              <Input
                id="licenseCategory"
                name="licenseCategory"
                value={formData.licenseCategory}
                onChange={handleChange}
                placeholder="Ex: A, B, AB"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="licenseValidity">Validade da CNH</Label>
              <Input
                id="licenseValidity"
                name="licenseValidity"
                type="date"
                value={formData.licenseValidity}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="observations">Observações</Label>
            <Textarea
              id="observations"
              name="observations"
              value={formData.observations}
              onChange={handleChange}
              placeholder="Informações adicionais sobre o cliente"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onClose()} disabled={loading}>
              Cancelar
            </Button>
            
        <div class="flex flex-col gap-1 mb-3"><label htmlFor="frentedacnh" class="text-sm font-medium">Frente da CNH</label>
          <input id="termoassinado" id="comprovantedeendereo" id="fotodocliente" id="versodacnh" id="frentedacnh" class="border p-2 rounded" type="file" name="licenseFrontFile" accept="image/*" onChange={(e) => setLicenseFrontFile(e.target.files?.[0] || null)} />
        </div>
        <div class="flex flex-col gap-1 mb-3"><label htmlFor="versodacnh" class="text-sm font-medium">Verso da CNH</label>
          <input class="border p-2 rounded" type="file" name="licenseBackFile" accept="image/*" onChange={(e) => setLicenseBackFile(e.target.files?.[0] || null)} />
        </div>
        <div class="flex flex-col gap-1 mb-3"><label htmlFor="fotodocliente" class="text-sm font-medium">Foto do Cliente</label>
          <input class="border p-2 rounded" type="file" name="photoFile" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} />
        </div>
        <div class="flex flex-col gap-1 mb-3"><label htmlFor="comprovantedeendereo" class="text-sm font-medium">Comprovante de Endereço</label>
          <input class="border p-2 rounded" type="file" name="proofFile" accept="image/*,application/pdf" onChange={(e) => setProofFile(e.target.files?.[0] || null)} />
        </div>
        <div class="flex flex-col gap-1 mb-3"><label htmlFor="termoassinado" class="text-sm font-medium">Termo Assinado</label>
          <input class="border p-2 rounded" type="file" name="termsFile" accept="image/*,application/pdf" onChange={(e) => setTermsFile(e.target.files?.[0] || null)} />
        </div>

<Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
