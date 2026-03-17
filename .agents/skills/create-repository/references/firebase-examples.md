# Firebase Examples - Repository com Firebase

Este documento contém exemplos de repositories usando Firebase (Firestore).

## Setup Inicial

```typescript
// app.config.ts
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

export const appConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp({
      apiKey: "...",
      authDomain: "...",
      projectId: "...",
      storageBucket: "...",
      messagingSenderId: "...",
      appId: "..."
    })),
    provideFirestore(() => getFirestore())
  ]
};
```

## Exemplo Completo: CustomerRepository com Firestore

```typescript
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Customer, CustomerInput } from '../types/customer.type';

@Injectable({ providedIn: 'root' })
export class CustomerRepository {
  private firestore = inject(Firestore);
  private collectionRef = collection(this.firestore, 'customers');

  /**
   * Busca todos os clientes
   */
  getAll(): Observable<Customer[]> {
    return collectionData(this.collectionRef, { idField: 'id' }).pipe(
      map(docs => docs.map(doc => this.toCustomer(doc)))
    );
  }

  /**
   * Busca cliente por ID
   */
  get(id: string): Observable<Customer> {
    const docRef = doc(this.firestore, `customers/${id}`);
    return docData(docRef, { idField: 'id' }).pipe(
      map(doc => this.toCustomer(doc))
    );
  }

  /**
   * Busca clientes com filtro
   */
  getByStatus(active: boolean): Observable<Customer[]> {
    const q = query(
      this.collectionRef,
      where('is_active', '==', active),
      orderBy('created_at', 'desc')
    );
    
    return collectionData(q, { idField: 'id' }).pipe(
      map(docs => docs.map(doc => this.toCustomer(doc)))
    );
  }

  /**
   * Busca com múltiplos filtros
   */
  search(filters: {
    active?: boolean;
    minCreatedAt?: Date;
    limitCount?: number;
  }): Observable<Customer[]> {
    const constraints: QueryConstraint[] = [];

    if (filters.active !== undefined) {
      constraints.push(where('is_active', '==', filters.active));
    }

    if (filters.minCreatedAt) {
      constraints.push(where('created_at', '>=', filters.minCreatedAt));
    }

    constraints.push(orderBy('created_at', 'desc'));

    if (filters.limitCount) {
      constraints.push(limit(filters.limitCount));
    }

    const q = query(this.collectionRef, ...constraints);
    
    return collectionData(q, { idField: 'id' }).pipe(
      map(docs => docs.map(doc => this.toCustomer(doc)))
    );
  }

  /**
   * Cria novo cliente
   */
  async create(input: CustomerInput): Promise<Customer> {
    const firestoreData = this.toFirestore(input);
    const docRef = await addDoc(this.collectionRef, firestoreData);
    
    return {
      id: docRef.id,
      ...input,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Atualiza cliente
   */
  async update(id: string, input: Partial<CustomerInput>): Promise<void> {
    const docRef = doc(this.firestore, `customers/${id}`);
    const updateData = {
      ...this.toFirestore(input),
      updated_at: new Date()
    };
    await updateDoc(docRef, updateData);
  }

  /**
   * Deleta cliente
   */
  async delete(id: string): Promise<void> {
    const docRef = doc(this.firestore, `customers/${id}`);
    await deleteDoc(docRef);
  }

  /**
   * Conversão Firestore → Domínio
   */
  private toCustomer(firestoreDoc: any): Customer {
    return {
      id: firestoreDoc.id,
      name: firestoreDoc.customer_name,
      email: firestoreDoc.email_address,
      phone: firestoreDoc.phone_number,
      active: firestoreDoc.is_active ?? true,
      createdAt: firestoreDoc.created_at?.toDate() || new Date(),
      updatedAt: firestoreDoc.updated_at?.toDate() || new Date()
    };
  }

  /**
   * Conversão Domínio → Firestore
   */
  private toFirestore(customer: Partial<CustomerInput>): any {
    const result: any = {};
    
    if (customer.name !== undefined) {
      result.customer_name = customer.name;
    }
    if (customer.email !== undefined) {
      result.email_address = customer.email;
    }
    if (customer.phone !== undefined) {
      result.phone_number = customer.phone;
    }
    
    return result;
  }
}
```

## Exemplo: Repository com Subcollections

```typescript
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class OrderRepository {
  private firestore = inject(Firestore);

  /**
   * Busca pedidos de um cliente específico
   */
  getByCustomer(customerId: string): Observable<Order[]> {
    const ordersRef = collection(
      this.firestore,
      `customers/${customerId}/orders`
    );
    
    return collectionData(ordersRef, { idField: 'id' }).pipe(
      map(docs => docs.map(doc => this.toOrder(doc)))
    );
  }

  /**
   * Adiciona pedido para um cliente
   */
  async addOrder(customerId: string, orderInput: OrderInput): Promise<Order> {
    const ordersRef = collection(
      this.firestore,
      `customers/${customerId}/orders`
    );
    
    const firestoreData = {
      ...orderInput,
      created_at: new Date()
    };
    
    const docRef = await addDoc(ordersRef, firestoreData);
    
    return {
      id: docRef.id,
      ...orderInput,
      createdAt: new Date()
    };
  }

  private toOrder(doc: any): Order {
    return {
      id: doc.id,
      total: doc.total,
      status: doc.status,
      createdAt: doc.created_at?.toDate() || new Date()
    };
  }
}
```

## Exemplo: Repository com Batch Operations

```typescript
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  writeBatch,
  doc
} from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class ProductRepository {
  private firestore = inject(Firestore);

  /**
   * Atualiza múltiplos produtos em batch
   */
  async updateMultiple(updates: Array<{ id: string; data: Partial<Product> }>): Promise<void> {
    const batch = writeBatch(this.firestore);

    updates.forEach(update => {
      const docRef = doc(this.firestore, `products/${update.id}`);
      batch.update(docRef, {
        ...update.data,
        updated_at: new Date()
      });
    });

    await batch.commit();
  }

  /**
   * Deleta múltiplos produtos em batch
   */
  async deleteMultiple(ids: string[]): Promise<void> {
    const batch = writeBatch(this.firestore);

    ids.forEach(id => {
      const docRef = doc(this.firestore, `products/${id}`);
      batch.delete(docRef);
    });

    await batch.commit();
  }
}
```

## Exemplo: Repository com Realtime Updates

```typescript
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionSnapshots,
  doc,
  docSnapshots
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NotificationRepository {
  private firestore = inject(Firestore);

  /**
   * Observa mudanças em tempo real na coleção
   */
  watchAll(): Observable<Notification[]> {
    const collectionRef = collection(this.firestore, 'notifications');
    
    return collectionSnapshots(collectionRef).pipe(
      map(snapshot => 
        snapshot.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Notification))
      )
    );
  }

  /**
   * Observa mudanças em um documento específico
   */
  watch(id: string): Observable<Notification> {
    const docRef = doc(this.firestore, `notifications/${id}`);
    
    return docSnapshots(docRef).pipe(
      map(snapshot => ({
        id: snapshot.id,
        ...snapshot.data()
      } as Notification))
    );
  }
}
```

## Exemplo: Repository com Storage (Upload de Arquivos)

```typescript
import { Injectable, inject } from '@angular/core';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from '@angular/fire/storage';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class CustomerRepository {
  private storage = inject(Storage);
  private firestore = inject(Firestore);

  /**
   * Upload de avatar do cliente
   */
  async uploadAvatar(customerId: string, file: File): Promise<string> {
    // Caminho no storage
    const path = `customers/${customerId}/avatar.jpg`;
    const storageRef = ref(this.storage, path);

    // Upload do arquivo
    await uploadBytes(storageRef, file);

    // Obter URL de download
    const downloadURL = await getDownloadURL(storageRef);

    // Atualizar documento do cliente com a URL
    const docRef = doc(this.firestore, `customers/${customerId}`);
    await updateDoc(docRef, {
      avatar_url: downloadURL,
      updated_at: new Date()
    });

    return downloadURL;
  }

  /**
   * Deleta avatar do cliente
   */
  async deleteAvatar(customerId: string): Promise<void> {
    const path = `customers/${customerId}/avatar.jpg`;
    const storageRef = ref(this.storage, path);

    // Deletar arquivo do storage
    await deleteObject(storageRef);

    // Remover URL do documento
    const docRef = doc(this.firestore, `customers/${customerId}`);
    await updateDoc(docRef, {
      avatar_url: null,
      updated_at: new Date()
    });
  }
}
```

## Diferenças entre collectionData e collectionSnapshots

### collectionData
- Retorna dados dos documentos
- Mais simples
- Não fornece metadados

```typescript
collectionData(collectionRef, { idField: 'id' })
```

### collectionSnapshots
- Retorna snapshots completos
- Acesso a metadados
- Mais controle

```typescript
collectionSnapshots(collectionRef).pipe(
  map(snapshots => snapshots.map(snap => ({
    id: snap.id,
    data: snap.data(),
    exists: snap.exists(),
    metadata: snap.metadata
  })))
)
```

## Boas Práticas com Firebase

1. **Use { idField: 'id' }** para incluir ID automaticamente
2. **Converta Timestamps** com `.toDate()`
3. **Use batch operations** para múltiplas escritas
4. **Índices compostos** para queries complexas
5. **Limite resultados** com `limit()` para performance
6. **Use subcollections** para dados aninhados
7. **Implemente offline persistence** quando apropriado
